require("dotenv").config();
var keys = require("./keys.js");
var fs = require("fs");
var Twitter = require("twitter");
var Spotify = require('node-spotify-api');
var request = require('request');

function logData(data) {
    fs.appendFile("result.txt", '\r\n\r\n');

    fs.appendFile("result.txt", JSON.stringify(data), function (err) {
        if (err) {
            return console.log(err);
        }
        console.log("result.txt was updated!");
    });
}

function movieSearch(movieName) {

    if (!movieName) {
        movieName = "Mr Nobody";
    } else {

        var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=trilogy";

        request(queryUrl, function (err, _res, body) {
            if (err) {
                console.log('Error occurred: ' + err);
                return;
            } else {
                let jsonData = JSON.parse(body);

                output = "\n<[ HEY MTV I'M LIRI, WELOME TO MY MOVIE RESULTS ]>" + '\n' +
                    '\nTitle: ' + jsonData.Title + '\n' +
                    '\nYear: ' + jsonData.Year + '\n' +
                    '\nRated: ' + jsonData.Rated + '\n' +
                    '\nIMDB Rating: ' + jsonData.imdbRating + '\n' +
                    '\nRotten Tomatoes Rating: ' + jsonData.Ratings[1].Value + '\n' +
                    '\nCountry: ' + jsonData.Country + '\n' +
                    '\nLanguage: ' + jsonData.Language + '\n' +
                    '\nPlot: ' + jsonData.Plot + '\n' +
                    '\nActors: ' + jsonData.Actors + "\n\n\n";

                console.log(output);
                fs.appendFile("result.txt", output, function (err) {
                    if (err) throw err;
                    console.log('result.txt updated !');
                });
            }
        });
    }
}

function spotifySongSearch(songName) {
    var spotify = new Spotify(keys.spotify);

    if (!songName) {
        songName = "The Sign";
    } else {

        spotify.search({ type: 'track', query: songName }, function (err, data) {
            if (err) {
                console.log('Error occurred: ' + err);
                return;
            } else {
                output = "\n<[ NOW THAT YOU'VE SEEN MY MOVIE THEATRE, LET ME SHOW YOU MY SPOTIFY STUDIO ]>" +
                    "\nSong Name: " + "'" + songName.toUpperCase() + '\n' +
                    "\nAlbum Name: " + data.tracks.items[0].album.name + '\n' +
                    "\nArtist Name: " + data.tracks.items[0].album.artists[0].name + '\n'
                    "\nURL: " + data.tracks.items[0].album.external_urls.spotify + "\n\n\n";
                console.log(output);

                fs.appendFile("result.txt", output, function (err) {
                    if (err) throw err;
                    console.log('result.txt was updated !');
                });
            };
        });
    }
}

function recentTweets() {
    var client = new Twitter(keys.twitter);
    var params = { screen_name: 'MEATGRINDA', count: 20 };

    client.get('statuses/user_timeline', params, function (err, tweets, _res) {

        if (!err) {
            var data = [];
            for (var i = 0; i < tweets.length; i++) {
                data.push({ 
                    '\n<[ NOW THAT YOU HAVE SEEN MY STUDIO CHECK OUT MY LAB WHERE I COOK UP MY TWEETS, HERE ARE SOME OF MY RECENTS ]>': [i],
                    'created at: ': tweets[i].created_at,
                    'Tweets: ': tweets[i].text,
                });
            }
            console.log(data);
            logData(data);
        }
    });
};

function tweetThis(tweetContent) {

    if (!tweetContent) {
        tweetContent = "well, ya'll know what it is";
    } else {

        var client = new Twitter(keys.twitter);

        client.post('statuses/update', { status: tweetContent }, function (error, tweet, _response) {
            if (error) throw error;
            console.log(tweet); 
            logData("your new tweet : " + tweetContent + " was posted to your twitter profile successfully !");
        });
    }
}


function doWhatItSays() {
    fs.readFile("random.txt", "utf8", function (error, data) {
        if (error) {
            console.log(error);
        } else {
            console.log(data);
            logData(data);
            var dataArr = data.split(',')

            if (dataArr.length == 2) {
                choice(dataArr[0], dataArr[1]);
            } else if (dataArr.length == 1) {
                (dataArr[0]);
            }
        }
    });
}

function choice(caseData, functionData) {
    switch (caseData) {
        case 'spotify-this-song':
            spotifySongSearch(functionData);
            break;
        case 'do-what-it-says':
            doWhatItSays();
            break;
        case 'my-tweets':
            recentTweets();
            break;
        case 'tweet-this':
            tweetThis(functionData);
            break;
        case 'movie-this':
            movieSearch(functionData);
            break;
        default:
            console.log('LIRI doesn\'t understand, please try again!');
    }
}

function appStart(arg0, arg1) {
    choice(arg0, arg1);
};

appStart(process.argv[2], process.argv[3]);