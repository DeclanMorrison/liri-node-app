console.log(`
                Welcome to
`);
console.log(
  `
:::        ::::::::::: :::::::::  ::::::::::: 
:+:            :+:     :+:    :+:     :+:     
+:+            +:+     +:+    +:+     +:+     
+#+            +#+     +#++:++#:      +#+     
+#+            +#+     +#+    +#+     +#+     
#+#            #+#     #+#    #+#     #+#     
########## ########### ###    ### ########### 
`);
const spotify = {
  id: process.env.SPOTIFY_ID,
  secret: process.env.SPOTIFY_SECRET
};

module.exports = spotify;