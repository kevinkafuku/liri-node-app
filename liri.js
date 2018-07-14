require("dotenv").config();
var keys = require("./keys.js");
var fs = require("fs");
var twitter = require("twitter");
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

                output = space + "================= LIRI RESULTS ==================" +
                    space + 'Title: ' + jsonData.Title +
                    space + 'Year: ' + jsonData.Year +
                    space + 'Rated: ' + jsonData.Rated +
                    space + 'IMDB Rating: ' + jsonData.imdbRating +
                    space + 'Rotten Tomatoes Rating: ' + jsonData.Ratings[1].Value +
                    space + 'Country: ' + jsonData.Country +
                    space + 'Language: ' + jsonData.Language +
                    space + 'Plot: ' + jsonData.Plot +
                    space + 'Actors: ' + jsonData.Actors + "\n\n\n";

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
                output = space + "|||||||| HEY MTV I'M LIRI, WELOME TO MY RESULTS |||||||" +
                    space + "Song Name: " + "'" + songName.toUpperCase() + "'" +
                    space + "Album Name: " + data.tracks.items[0].album.name +
                    space + "Artist Name: " + data.tracks.items[0].album.artists[0].name +
                    space + "URL: " + data.tracks.items[0].album.external_urls.spotify + "\n\n\n";
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
    var client = new twitter(keys.twitter);
    var params = { screen_name: '540life', count: 20 };

    client.get('statuses/user_timeline', params, function (err, tweets, _res) {

        if (!err) {
            var data = [];
            for (var i = 0; i < tweets.length; i++) {
                data.push({
                    'created at: ': tweets[i].created_at,
                    'Tweets: ': tweets[i].text,
                });
            }
            console.log(data);
            writeToLog(data);
        }
    });
};

function tweetThis(tweetContent) {

    if (!tweetContent) {
        tweetContent = "This is a random tweet!";
    } else {

        var client = new twitter(keys.twitter);

        client.post('statuses/update', { status: tweetContent }, function (error, tweet, _response) {
            if (error) throw error;
            console.log(tweet); 
            writeToLog("your new tweet : " + tweetContent + " was posted to your twitter profile successfully !");
        });
    }
}


function doWhatItSays() {
    fs.readFile("random.txt", "utf8", function (error, data) {
        if (error) {
            console.log(error);
        } else {
            console.log(data);
            writeToLog(data);
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
            spotifyThisSong(functionData);
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