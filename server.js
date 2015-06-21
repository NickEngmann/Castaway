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

app.get('/', function(request, response) {
    response.redirect('/index');
});

app.get('/index', function(request, response) {
    response.render('index.jade');
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
