var express = require('express');
var queries = require('./queries.js');
var app = express();
var php = require('php-node')({bin:"php"});

app.use(express.bodyParser());
app.use(express.logger('dev'));
app.set('views', __dirname + '/views');
app.use(express.static('public'));
app.engine('php', php);
app.set('view engine', 'php');
//ejs
app.locals.basedir = __dirname + "/public";

playlists = [
    [
        {"title": "A Comic History of the U.S 01", "url": "http://www.archive.org/download/comic_history_us_0807_librivox/comichistoryofus_01_nye_64kb.mp3"},
        {"title": "A Comic History of the U.S 02", "url": "http://www.archive.org/download/comic_history_us_0807_librivox/comichistoryofus_02_nye_64kb.mp3"},
        {"title": "A Comic History of the U.S 03", "url": "http://www.archive.org/download/comic_history_us_0807_librivox/comichistoryofus_03_nye_64kb.mp3"},
        {"title": "A Comic History of the U.S 04", "url": "http://www.archive.org/download/comic_history_us_0807_librivox/comichistoryofus_04_nye_64kb.mp3"},
        {"title": "A Comic History of the U.S 05", "url": "http://www.archive.org/download/comic_history_us_0807_librivox/comichistoryofus_05_nye_64kb.mp3"},
        {"title": "A Comic History of the U.S 06", "url": "http://www.archive.org/download/comic_history_us_0807_librivox/comichistoryofus_06_nye_64kb.mp3"},
        {"title": "A Comic History of the U.S 07", "url": "http://www.archive.org/download/comic_history_us_0807_librivox/comichistoryofus_07_nye_64kb.mp3"},
        {"title": "A Comic History of the U.S 08", "url": "http://www.archive.org/download/comic_history_us_0807_librivox/comichistoryofus_08_nye_64kb.mp3"},
        {"title": "A Comic History of the U.S 09", "url": "http://www.archive.org/download/comic_history_us_0807_librivox/comichistoryofus_09_nye_64kb.mp3"},
        {"title": "A Comic History of the U.S 10", "url": "http://www.archive.org/download/comic_history_us_0807_librivox/comichistoryofus_10_nye_64kb.mp3"},
        {"title": "A Comic History of the U.S 11", "url": "http://www.archive.org/download/comic_history_us_0807_librivox/comichistoryofus_11_nye_64kb.mp3"},
        {"title": "A Comic History of the U.S 12", "url": "http://www.archive.org/download/comic_history_us_0807_librivox/comichistoryofus_12_nye_64kb.mp3"},
        {"title": "A Comic History of the U.S 13", "url": "http://www.archive.org/download/comic_history_us_0807_librivox/comichistoryofus_13_nye_64kb.mp3"},
        {"title": "A Comic History of the U.S 14", "url": "http://www.archive.org/download/comic_history_us_0807_librivox/comichistoryofus_14_nye_64kb.mp3"},
        {"title": "A Comic History of the U.S 15", "url": "http://www.archive.org/download/comic_history_us_0807_librivox/comichistoryofus_15_nye_64kb.mp3"},
        {"title": "A Comic History of the U.S 16", "url": "http://www.archive.org/download/comic_history_us_0807_librivox/comichistoryofus_16_nye_64kb.mp3"},
    ],
    [
        {"title": "Civil War 84", "url": "http://traffic.libsyn.com/civilwarpodcast/CivilWar84.mp3"},
        {"title": "Civil War 25", "url": "http://traffic.libsyn.com/civilwarpodcast/CivilWar25.mp3"},
        {"title": "Civil War 42", "url": "http://traffic.libsyn.com/civilwarpodcast/CivilWar42.mp3"}
    ],
    [
        
    ]
];

currentPlaylist = 0;
currentEpisode = 0;
searchPlaylist = [];

app.get('/', function(request, response) {
    response.redirect('/index');
});

app.get('/index', function(request, response) {
    response.render('index.jade', { playlists: playlists });
});

app.post('/setPlaylist', function(request, response) {
    var idx = request.body.idx;
    currentPlaylist = idx;
    currentEpisode = 0;
    response.send(playlists[idx][0]);
});

app.post('/getNext', function(request, response) {
    if (currentPlaylist === "search") {
        currentEpisode = (currentEpisode + 1) % searchPlaylist.length;
        response.send(searchPlaylist[currentEpisode]);
    } else {
        currentEpisode = (currentEpisode + 1) % playlists[currentPlaylist].length;
        response.send(playlists[currentPlaylist][currentEpisode]);        
    }
});

app.post('/search', function(request, response) {
    var name     = request.body.name;
    var period   = request.body.period;
    var location = request.body.location;

    queries.findPodcasts(name, period, location, function(err, results) {
        if (err) {
            console.log(err);
            response.send("ok");
        } else {
            console.log(results);  
            searchPlaylist = results;
            currentPlaylist = "search";
            currentEpisode = 0;
            response.send(searchPlaylist[0]);
        }
    });
});

var server = app.listen(3000, function () {
    var host = server.address().address;
    var port = server.address().port;
    console.log('CastAway listening at http://%s:%s', host, port);
});
