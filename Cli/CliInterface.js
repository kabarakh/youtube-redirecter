(function () {

    var RedirectRepository = require('../Domain/Repository/RedirectRepository');
    var Redirect = require('../Domain/Model/Redirect');
    var Logger = require('../Utility/Logger');

    var addRoute = function (localRoute, remoteUrl) {
        var urlSegments = localRoute.split('/');
        if (urlSegments[0] === '') {
            urlSegments.shift();
        }

        var existingRoutePromise = RedirectRepository.findOneByUrlPartsNotRecursive(urlSegments);

        return existingRoutePromise.then(function (existingRoute) {
            if (existingRoute === null) {
                var newRedirect = Redirect.create({
                    sourceUrl: urlSegments,
                    targetUrl: remoteUrl
                });

                Logger.info(`Successfully added route ${localRoute} with target url ${remoteUrl}`);

                return newRedirect;
            } else {
                Logger.error(`Route ${localRoute} exists already with target ${existingRoute.targetUrl}`);
                return false;
            }
        });
    };

    var deleteRoute = function (localRoute) {
        var urlSegments = localRoute.split('/');
        if (urlSegments[0] === '') {
            urlSegments.shift();
        }

        var existingRoutePromise = RedirectRepository.findOneByUrlPartsNotRecursive(urlSegments);

        return existingRoutePromise.then(function (existingRoute) {
            if (existingRoute !== null) {
                var deleteResult = Redirect.deleteOne({
                    sourceUrl: urlSegments
                });

                Logger.info(`Successfully deleted route ${localRoute}`);

                return deleteResult;
            } else {
                Logger.info(`Route ${localRoute} not found`);
                return false;
            }
        });
    };

    var listRoutes = function () {
        return Redirect
            .find()
            .exec();
    };

    module.exports = {
        addRoute: addRoute,
        deleteRoute: deleteRoute,
        listRoutes: listRoutes
    };

})();
