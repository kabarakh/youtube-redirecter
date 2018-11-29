(function () {
    var mongoose = require('mongoose'),
        url = require('url'),
        dbConfig = require('./config').db;

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

    var promise = mongoose.connect(mongoUrl, {
        useNewUrlParser: true
    });

    module.exports = promise;

})();
