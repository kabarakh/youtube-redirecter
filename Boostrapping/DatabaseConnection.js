var mongoose = require('mongoose'),
    url = require('url'),
    dbConfig = require('./config').db,
    q = require('q');

mongoose.Promise = require('q').Promise;

var urlObject = {
    protocol: 'mongodb',
    slashes: true,
    auth: dbConfig.username + ':' + dbConfig.password,
    hostname: dbConfig.server,
    port: dbConfig.port,
    pathname: dbConfig.database
};

var mongoUrl = url.format(urlObject);

console.log('connecting to db ' + mongoUrl);

var deferred = q.defer();

mongoose.connect(mongoUrl, function(error) {
    if (error) {
        deferred.reject('db connection failed');
    } else {
        deferred.resolve();
    }
});

module.exports = deferred.promise;