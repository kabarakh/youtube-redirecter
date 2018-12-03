var config = require('./Bootstrapping/config');
var commander = require('commander');
var Webserver = require('./Webserver/Webserver');
var CliInterface = require('./Cli/CliInterface');
var dbConnectionPromise = require('./Bootstrapping/DatabaseConnection');
var Logger = require('./Utility/Logger');
var _ = require('lodash');
var cliFormat = require('cli-format');

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
                    if (!routesList) {
                        Logger.info('No routes found');
                    } else {
                        Logger.cliOutput('Available routes:');

                        Logger.cliOutput(
                            cliFormat.columns.wrap(
                                [
                                    'sourcePath',
                                    'targetUrl'
                                ], {
                                    width: 80,
                                    paddingMiddle: ' | '
                                })
                        );

                        _.forEach(routesList, function (singleRoute) {
                            Logger.cliOutput(
                                cliFormat.columns.wrap(
                                    [
                                        singleRoute.sourceUrl.join('/'),
                                        singleRoute.targetUrl
                                    ], {
                                        width: 80,
                                        paddingMiddle: ' | '
                                    })
                            );
                        });
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
