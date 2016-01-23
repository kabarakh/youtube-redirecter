var express = require('express'),
    config = require('./Boostrapping/config');

var app = express();
    redirectRepository = require('./Domain/Repository/RedirectRepository');

var dbConnected = false;

var dbConnectionPromise = require('./Boostrapping/DatabaseConnection');
dbConnectionPromise.then(function() {
    dbConnected = true;
}).catch(console.log);
// todo split url parts
// todo get url from mongoose per url parts
// todo fallback url to pls if non existing playlist, fallback to channel if non-pls
// todo save referrer, input url and resulting url
// todo maybe add admin tool, url param protected



app.get('*', function(request, response) {

    var redirectToChannelPage = function() {
        var channelUrl = config.channelUrl;
        response.writeHead(302, {
            Location: channelUrl
        });
        response.end();
    };

    if (!dbConnected) {
        redirectToChannelPage();
    } else {
        console.log(request.url);
        var urlSegments = request.url.split('/');
        if (urlSegments[0] === '') {
            urlSegments.shift();
        }

        var redirectPromise = redirectRepository.findOneByUrlParts(urlSegments);

        redirectPromise.then(function(data) {

        }, function(reason) {
            console.log('failure with url', request.url, ':', reason.toString());
            redirectToChannelPage();
        });
    }

});

app.listen(config.port);

