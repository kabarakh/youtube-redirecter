var config = require('./Bootstrapping/config');
var commander = require('commander');
var Webserver = require('./Webserver/Webserver');
var CliInterface = require('./Cli/CliInterface');
var dbConnectionPromise = require('./Bootstrapping/DatabaseConnection');
var Logger = require('./Utility/Logger');
var _ = require('lodash');
var Table = require('easy-table')

var initializeCommand = function () {
    var commandRan = false;
    commander
        .version('0.8.15');

    commander
        .command('webserver:start')
        .description('Start the redirect webserver')
        .action(function () {
            commandRan = true;

            Webserver.startWebserver();
        });

    commander
        .command('routes:list')
        .action(function () {
            commandRan = true;

            CliInterface
                .listRoutes()
                .then(function (routesList) {
                    if (!routesList.length) {
                        Logger.cliOutput('');
                        Logger.cliOutput('No routes found');
                    } else {
                        Logger.cliOutput('');
                        Logger.cliOutput('Available routes:');
                        Logger.cliOutput('');

                        var outputTable = new Table();

                        _.forEach(routesList, function (singleRoute) {
                            outputTable.cell('Source URL', singleRoute.sourceUrl.join('/'))
                            outputTable.cell('Target URL', singleRoute.targetUrl)
                            outputTable.newRow();
                        });
                        Logger.cliOutput(outputTable.toString());
                    }
                    return;
                }).then(function () {
                    Logger.debug('Exiting cli');
                    process.exit(0);
                }).catch(Logger.error);

        });

    commander
        .command('routes:add <localRoute> <remoteUrl>')
        .action(function (localRoute, remoteUrl) {
            commandRan = true;

            CliInterface
                .addRoute(localRoute, remoteUrl)
                .then(function () {
                    Logger.debug('Exiting cli');
                    process.exit(0);
                });
        });

    commander
        .command('routes:delete <localRoute>')
        .action(function (localRoute) {
            commandRan = true;

            CliInterface
                .deleteRoute(localRoute)
                .then(function () {
                    Logger.debug('Exiting cli');
                    process.exit(0);
                });
        });

    commander.parse(process.argv);

    if (!commandRan) {
        commander.outputHelp();
        process.exit(0);
    }
}

dbConnectionPromise.then(function () {
    Logger.debug('Exiting cli');
    initializeCommand();
}).catch(function (data) {
    Logger.error(data);
    process.exit(1);
});
