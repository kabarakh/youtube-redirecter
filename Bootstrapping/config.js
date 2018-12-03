(function () {

    var env = require('dotenv').config();

    module.exports = {
        port: process.env.WEBSERVER_PORT,

        channelUrl: process.env.FALLBACK_URL,

        db: {
            username: process.env.DB_USERNAME,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_DBNAME,
            server: process.env.DB_HOSTNAME,
            port: process.env.DB_PORT
        },

        debug: process.env.LOG_DEBUG === 'true'
    }
})();
