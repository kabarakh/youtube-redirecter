(function () {
    var moment = require('moment');
    var config = require('../Bootstrapping/config');

    var log = function (type, ...args) {
        var currentDateTime = moment().format('YYYY-MM-DD HH:mm:ss');

        if (type === 'ERROR') {
            console.error(currentDateTime, '[' + type + ']', ...args);
        } else {
            console.log(currentDateTime, '[' + type + ']', ...args);
        }
    }

    var info = function(...args) {
        log('INFO', ...args);
    }

    var error = function(...args) {
        log('ERROR', ...args);
    }

    var debug = function(...args) {
        if (config.debug) {
            log('DEBUG', ...args);
        }
    }

    var cliOutput = function(...args) {
        console.log(...args);
    }

    module.exports = {
        debug: debug,
        info: info,
        error: error,
        cliOutput: cliOutput
    }
})();
