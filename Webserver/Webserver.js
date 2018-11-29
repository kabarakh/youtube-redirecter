(function () {

    var startWebserver = function () {
        var express = require('express'),
            config = require('../Boostrapping/config');

        var app = express();
        redirectRepository = require('../Domain/Repository/RedirectRepository');

        // todo: save referrer, input url and resulting url

        app.get('/favicon.ico', function (request, response) {
            response.end();
        });

        app.get('/robots.txt', function (request, response) {
            response.send('User-agent: *\nDisallow: /');
            response.end();
        });

        app.get('*', function (request, response) {

            var redirectToChannelPage = function () {
                response.redirect(config.channelUrl);
            };

            console.log(request.url);
            var urlSegments = request.url.split('/');
            if (urlSegments[0] === '') {
                urlSegments.shift();
            }

            var redirectPromise = redirectRepository.findOneByUrlParts(urlSegments);

            redirectPromise.then(function (data) {
                console.log(`found targetUrl ${data.targetUrl} for ${request.url}, redirecting user`);
                response.redirect(data.targetUrl);
            }, function (reason) {
                console.log('failure with url', request.url, ':', reason.toString());
                redirectToChannelPage();
            });

        });

        app.listen(config.port, '127.0.0.1');
        console.log('Server started on http://127.0.0.1:' + config.port);
    }

    module.exports = {
        startWebserver: startWebserver
    };
})();
