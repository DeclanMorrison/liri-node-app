require("dotenv").config();
const request = require("request");
const Spotify = require("node-spotify-api");
const inquirer = require("inquirer");
const moment = require("moment");
const fs = require("fs");
const keys = require("./keys.js");
const spotify = new Spotify(keys);
// console.log(keys);

//Function Declarations

const bandsInTown = function (artist) {
  console.log(
`
    ____                     __         ____          ______                     
   / __ ) ____ _ ____   ____/ /_____   /  _/____     /_  __/____  _      __ ____ 
  / __  |/ __ '// __ \\ / __  // ___/   / / / __ \\     / /  / __ \\| | /| / // __ \\
 / /_/ // /_/ // / / // /_/ /(__  )  _/ / / / / /    / /  / /_/ /| |/ |/ // / / /
/_____/ \\__,_//_/ /_/ \\__,_//____/  /___//_/ /_/    /_/   \\____/ |__/|__//_/ /_/ 
`
    );
  const queryURL = `https://rest.bandsintown.com/artists/${artist}/events?app_id=00998e22b3acfbe3849f8bd2ca871017`;
  request(queryURL, function (err, response, body){
    const parsed = JSON.parse(body);
    console.log(`Show Lineup: ${parsed[0].lineup}`);
    const date = moment(parsed[0].datetime, "YYYY-MM-DD");
    console.log(`Date: ${date}`);
    console.log(`Venue: ${parsed[0].venue.name}`);
    console.log(`Location: ${parsed[0].venue.city}, ${parsed[0].venue.region}, ${parsed[0].venue.country}`);
    main();
  });
};

const spotifyAPI = function (song) {
  if (song === ""){
    song = "The Sign";
  }
  
  spotify.search({
    type: 'track',
    query: song
  }, function(err, data){
    if (err){
      return console.log(`An error occured with the Spotify API: ${err}`);
    };
    
    console.log(
`
   _____                __   _  ____      
  / ___/ ____   ____   / /_ (_)/ __/__  __
  \\__ \\ / __ \\ / __ \\ / __// // /_ / / / /
 ___/ // /_/ // /_/ // /_ / // __// /_/ / 
/____// .___/ \\____/ \\__//_//_/   \\__, /  
     /_/                         /____/   
`
    );

    console.log(`Artist: ${data.tracks.items[0].artists[0].name}`);
    console.log(`Song: ${data.tracks.items[0].name}`);
    console.log(`Album: ${data.tracks.items[0].album.name}`);
    console.log(`Listen on Spotify: ${data.tracks.items[0].external_urls.spotify}`);
    main();

  });
};

const ombdAPI = function (movie) {
  const queryURL = `http://www.omdbapi.com/?apikey=trilogy&type=movie&t=${movie}`;
  request(queryURL, function (err, response, body){
    const parsed = JSON.parse(body);
    console.log(
`
   ____   __  ___ ____   ____ 
  / __ \\ /  |/  // __ \\ / __ )
 / / / // /|_/ // / / // __  |
/ /_/ // /  / // /_/ // /_/ / 
\\____//_/  /_//_____//_____/ 
`
    )
    console.log(`Title: ${parsed.Title}`);
    console.log(`Year: ${parsed.Year}`);
    console.log(`IMBD Rating: ${parsed.Ratings[0].Value}`);
    console.log(`Rotten Tomatoes Rating: ${parsed.Ratings[1].Value}`);
    console.log(`Country: ${parsed.Country}`);
    console.log(`Language: ${parsed.Language}`);
    console.log(`Plot: ${parsed.Plot}`);
    console.log(`Actors: ${parsed.Actors}`);
    main();

  });
};

const main = function () {
  console.log(
    `
=============================================
    `
  );
  inquirer.prompt([
    {
      type: "list",
      name: "choose",
      message: "Which API would you like to do?",
      choices: ["Bands In Town", "Spotify", "OMBD", "I'm Feeling Lucky", "Exit"]
    }
  ]).then(function(response){
    console.log(response.choose);

    switch (response.choose){
      case "Bands In Town":
        inquirer.prompt([
          {
            name: "band",
            message: "What band would you like to search for?",
          }
        ]).then(function(response){
          bandsInTown(response.band);
        });
        break;
      case "Spotify":
        inquirer.prompt([
          {
            name: "song",
            message: "What song would you like to search for?",
          }
        ]).then(function(response){
          if (response.song === ""){
            response.song = "The Sign"
          }
          spotifyAPI(response.song);
        });
        break;
      case "OMBD":
        inquirer.prompt([
          {
            name: "movie",
            message: "What movie would you like to search for?",
          }
        ]).then(function(response){
          if (response.movie === ""){
            response.movie = "Mr. Nobody"
          };
          ombdAPI(response.movie);
        });
        break;
      case "I'm Feeling Lucky":
        fs.readFile("./random.txt", "utf-8", (err, data) => {
          const dataSplit = data.split("\r\n");
          const rand = Math.floor(Math.random() * 3);
          const chosen = dataSplit[rand];
          const chosenSplit = chosen.split(" ");
          const chosenFunction = chosenSplit.shift();
          const chosenTerm = chosenSplit.join(" ");
          switch (chosenFunction){
            case "Spotify":
              spotifyAPI(chosenTerm);
              break;
            case "BandsInTown":
              bandsInTown(chosenTerm);
              break;
            case "OMBD":
              ombdAPI(chosenTerm);
              break;
          };
        });
        break;
      case "Exit":
        return false;
        break;
    };
  });
};
main();
