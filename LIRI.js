require("dotenv").config();

var keys = require("./keys.js")
var Twitter = require("twitter");
var Spotify = require("node-spotify-api");
var request = require("request");
var fs = require("fs");

var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);
var command = process.argv[2];

function liriSwitch(command, search){
switch(command){
    case "my-tweets":
    console.log("test");
        client.get("statuses/user_timeline",function(error,tweets)
        {
            if(error){
                console.log("Error");
            }
            else{
                for (var i = 0; i< 5;i++){
                    console.log("Date Tweeted: " + tweets[i].created_at +"\nTweet: " + tweets[i].text + "\n");
                }
            }
        });
    break;


    case "spotify-this-song":
        var count = 4;
        var songName = process.argv[3];

        if(songName != null){
            while( process.argv[count] != null){
            songName += " " + process.argv[count];
            count++
            }
         }
         else{
             songName = "The Sign";
         }
            spotify.search({type: 'track', query: songName, limit:1},function(error,song)
        {
            if(error){
                console.log("error");
            }
            else{
                var recievedSong = song.tracks.items[0];
               
                 console.log("\nArtist: "+ recievedSong.artists[0].name +
                    "\nSong name: " + recievedSong.name +
                    "\nLink: " + recievedSong.preview_url + 
                    "\nAlbum: " + recievedSong.album.name);
                }
            
        });

    break;

    case "movie-this":
        var count = 4;
        var movieName = process.argv[3];

        if(movieName != null){
            while( process.argv[count] != null){
            movieName += " " + process.argv[count];
            count++
            }
         }
         else{
             movieName = "Mr.Nobody";
         }
        
        var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=trilogy";

    request(queryUrl, function(error, response, body) {
    if (!error && response.statusCode === 200) {
        var recievedMovie = JSON.parse(body);
        console.log("\nTitle: " + recievedMovie.Title + 
            "\nRelease Date: " + recievedMovie.Year +
            "\nRated: " + recievedMovie.Rated +
            "\nRating: " + recievedMovie.Ratings[2].Value +
            "\nCountry/Countries: " + recievedMovie.Country +
            "\nLanguage(s): " + recievedMovie.Language +
            "\nPlot: " + recievedMovie.Plot +
            "\nMain Cast: " + recievedMovie.Actors);
    }
  });
    break;

    case "do-what-it-says":
     fs.readFile("random.txt", "utf8", function(error, random)
            {
                 random = random.split(",");
                 command = random[0];
                 var search = random[1];
                 liriSwitch(command,search);
                
            });

    default:
     console.log("\nSorry '" + command +"' is not a command, commands are:");
     console.log("1) my-tweets   \n2) spotify-this-song '<song name here>'    \n3) movie-this '<movie name here>'    \n4) do-what-it-says");
    break;
}
}
liriSwitch(command);
