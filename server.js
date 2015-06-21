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
        "http://www.archive.org/download/comic_history_us_0807_librivox/comichistoryofus_01_nye_64kb.mp3",
        "http://www.archive.org/download/comic_history_us_0807_librivox/comichistoryofus_02_nye_64kb.mp3",
        "http://www.archive.org/download/comic_history_us_0807_librivox/comichistoryofus_03_nye_64kb.mp3",
        "http://www.archive.org/download/comic_history_us_0807_librivox/comichistoryofus_04_nye_64kb.mp3",
        "http://www.archive.org/download/comic_history_us_0807_librivox/comichistoryofus_05_nye_64kb.mp3",
        "http://www.archive.org/download/comic_history_us_0807_librivox/comichistoryofus_06_nye_64kb.mp3",
        "http://www.archive.org/download/comic_history_us_0807_librivox/comichistoryofus_07_nye_64kb.mp3",
        "http://www.archive.org/download/comic_history_us_0807_librivox/comichistoryofus_08_nye_64kb.mp3",
        "http://www.archive.org/download/comic_history_us_0807_librivox/comichistoryofus_09_nye_64kb.mp3",
        "http://www.archive.org/download/comic_history_us_0807_librivox/comichistoryofus_10_nye_64kb.mp3",
        "http://www.archive.org/download/comic_history_us_0807_librivox/comichistoryofus_11_nye_64kb.mp3",
        "http://www.archive.org/download/comic_history_us_0807_librivox/comichistoryofus_12_nye_64kb.mp3",
        "http://www.archive.org/download/comic_history_us_0807_librivox/comichistoryofus_13_nye_64kb.mp3",
        "http://www.archive.org/download/comic_history_us_0807_librivox/comichistoryofus_14_nye_64kb.mp3",
        "http://www.archive.org/download/comic_history_us_0807_librivox/comichistoryofus_15_nye_64kb.mp3",
        "http://www.archive.org/download/comic_history_us_0807_librivox/comichistoryofus_16_nye_64kb.mp3",
    ],
    [
        "http://traffic.libsyn.com/civilwarpodcast/CivilWar84.mp3",
        "http://traffic.libsyn.com/civilwarpodcast/CivilWar25.mp3",
        "http://traffic.libsyn.com/civilwarpodcast/CivilWar42.mp3"
    ],
    [
        
    ]
];

currentPlaylist = 0;
currentEpisode = 0;

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
    currentEpisode = (currentEpisode + 1) % playlists[currentPlaylist].length;
    response.send(playlists[currentPlaylist][currentEpisode]);
});

app.post('/search', function(request, response) {
    var name     = request.body.name;
    var period   = request.body.period;
    var location = request.body.location;

    queries.findPodcasts(name, period, location, function(err, results) {
        if (err) {
            console.log(err);
        } else {
            console.log(results);
            response.redirect('/index')
        }
    });
});

var server = app.listen(3000, function () {
    var host = server.address().address;
    var port = server.address().port;
    console.log('CastAway listening at http://%s:%s', host, port);
});
