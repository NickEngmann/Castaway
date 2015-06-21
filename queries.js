var http = require('http');
var itunes = require('searchitunes');
var htmlparser = require('htmlparser2');

var makeRequest = function(options, onEnd) {
    reqCallback = function(response) {
        var str = '';
        var links = [];

        response.on('data', function (chunk) {
            str += chunk;
        });

        response.on('end', function () {
            onEnd(str);
        });
    }
    var req = http.request(options, reqCallback);
    req.end();
}

var findEpisodes = function(title, radioUrl, callback) {
    var options = {
        host: 'itunes.so-nik.com',
        path: '/getfeed.php?terms=' + radioUrl,
        method: 'POST'
    };

    console.log("making request");
    makeRequest(options, function (str) {
        console.log("made request");
        var link = false;
        var found = false;

        // Find rss feed for podcast through helper website
        var parser = new htmlparser.Parser({
            onopentag: function(name, attribs){
                if(name === "a") {
                    link = true;
                }
            },
            ontext: function(text){
                console.log("link: " + link);
                console.log("ontext: " + text);
                if (link && !found) {
                    console.log(text);
                    found = true;
                    var partition = text.split("://");
                    var host_path = partition[1].split("/");
                    var host = host_path.shift();
                    var options = {
                        host: host,
                        path: "/" + host_path.join("/"),
                    };

                    // Request and parse rss feed for podcast
                    makeRequest(options, function (str) {
                        var inItem = false;
                        var currElem = "";
                        var description = "";
                        var url = "";

                        var results = [];
                        var parser = new htmlparser.Parser({
                            onopentag: function(name, attribs) {
                                if(name === "item") {
                                    inItem = true;
                                }
                                else if(inItem && name === "enclosure") {
                                    url = attribs.url;
                                    console.log(url);
                                } else {
                                    currElem = name;
                                }
                            },
                            ontext: function(text) {
                                if (currElem === "description") {
                                    description = text;
                                }
                            },
                            onclosetag: function(name) {
                                if(name === "item") {
                                    if (inItem) {
                                        results.push({'title': title, 'url': url,});
                                        inItem = false;
                                    }
                                } else if (name === "description") {
                                    inDescription = false;
                                }
                            }
                        });

                        parser.write(str);
                        parser.end();
                        callback(null, results);
                    });
                }
            },
            onclosetag: function(tagname){
                link = false;
            }
        });

        parser.write(str);
        parser.end();
    });
}

var findPodcasts = function(name, period, location, callback) {
    var query = {
        entity: 'podcast',
        country: 'US',
        term: [name, period, location].join("+"),
        attribute: "descriptionTerm",
    };

    console.log("query: " + query['term']);
    itunes(query, function(err, data) {
        if (err) {
            callback(err, null)
        } else {
            var full_podcasts = [];
            var idxs = [];
            var len = Math.min(1, data['results'].length);

            console.log("calc: " + len);
            for (i = 0; i < len; i++) {
                idxs.push(data['results'].splice(Math.floor(Math.random()*data['results'].length), 1)[0]);
            }

            console.log(idxs.length);
            for (i in idxs) {
                var map = {
                    title: idxs[i]['trackName'],
                    artist: idxs[i]['artistName'],
                    radioUrl: idxs[i]['radioStationUrl'],
                    tags: idxs[i]['keywords'],

                    img: {
                        30:  idxs[i]['artworkUrl30'],
                        60:  idxs[i]['artworkUrl60'],
                        100: idxs[i]['artworkUrl100'],
                        600: idxs[i]['artworkUrl600']
                    }
                };

                console.log("calling findeps");
                findEpisodes(map['title'], map['radioUrl'], function(err, results) {
                    map['results'] = results;
                    full_podcasts.push(map);
                    if (full_podcasts.length >= len) {
                        callback(null, map['results'])
                    }
                });
            }
        }
    });
}

module.exports = {
    findPodcasts: findPodcasts,
};
