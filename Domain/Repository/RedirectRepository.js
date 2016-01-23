var mongoose = require('mongoose'),
    q = require('q'),
    Redirect = require('../Model/Redirect');

module.exports = {

    findOneByUrlParts: function (urlParts) {

        var resolveMongooseCall = function (urlParts, deferred) {
            console.log('trying repo findOneByUrlParts with ', urlParts.toString());

            Redirect.findOne({SourceUrl: urlParts}, function (error, redirect) {

                if (error) {
                    deferred.reject(error.toString());
                } else {
                    if (redirect === null) {
                        urlParts.pop();

                        if (urlParts.length === 0) {
                            deferred.reject('nothing found');
                        } else {
                            var intermediatePromise = resolveMongooseCall(urlParts, deferred);
                            intermediatePromise.then(function (redirect) {
                                deferred.resolve(redirect);
                            }, function (reason) {
                                deferred.reject(reason);
                            });
                        }
                    } else {
                        deferred.resolve(redirect);
                    }
                }
            });

            return deferred.promise;
        };

        var deferred = q.defer();

        return resolveMongooseCall(urlParts, deferred);
    }


};