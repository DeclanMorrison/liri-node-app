require("dotenv").config();
const request = require("request");
const Spotify = require("node-spotify-api");
const inquirer = require("inquirer");
const keys = require("./keys.js");
const spotify = new Spotify(keys);
// console.log(keys);

//Function Declarations

const bandsInTown = function (artist) {
  const queryURL = `https://rest.bandsintown.com/artsts/${artist}/events?app_id=codingbootcamp`;
  request(queryURL, function (err, response, body){
    // console.log("Error:", err);
    // console.log("Status Code", response);
    console.log("Body:", body);
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
=========================================
 ___   ___   ___  _____ _____  ____ .   .
[___  |___] |   |   |     |   |__    \\ /
 ___] |     |___|   |   __|__ |       |
 
=========================================
`
    )
    console.log(data.tracks.items[0].artists.name);
    console.log(data.tracks.items[0].name);
    console.log(data.tracks.items[0].external_urls.spotify);
    console.log(data.tracks.items[0].album.name);
  });
};

const ombdAPI = function (movie) {
  const queryURL = `http://www.omdbapi.com/?apikey=trilogy&type=movie&t=${movie}`;
  request(queryURL, function (err, response, body){
    const parsed = JSON.parse(body);
    console.log(
`
==========================
  ____   _    _ ____   ___
/    \\  |\\  /| |   \\  |__]
|    |  | \\/ | |    | |  \\
\\____/  |    | |___/  |__/

==========================
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
  });
};

const main = function () {
  inquirer.prompt([
    {
      type: "list",
      name: "choose",
      message: "Which API would you like to do?",
      choices: ["Bands In Town", "Spotify", "OMBD", "I'm Feeling Lucky"]
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
          spotifyAPI(response.song);
        });
        break;
      case "OMDB":
        inquirer.prompt([
          {
            name: "movie",
            message: "What movie would you like to search for?",
          }
        ]).then(function(response){
          ombdAPI(response.movie);
        });
        break;
      case "I'm Feeling Lucky":
        break;
    }
  });
};
main();

//PUT THESE INTO THE .ENV
// # Spotify API keys

// SPOTIFY_ID=e964894de0494f65989af5725673f2ac
// SPOTIFY_SECRET=0d0597e5b25d4171b13dd107223879f8
