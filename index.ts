import commander = require('commander');
import Table from 'easy-table';
import * as _ from 'lodash';

import Configfrom from './Bootstrapping/Config';
import DatabaseConnection from './Bootstrapping/DatabaseConnection';
import CliInterface from './Cli/CliInterface';
import { RedirectInterface } from './Domain/Model/Redirect';
import Logger from './Utility/Logger';
import Webserver from './Webserver/Webserver';

const dbConnectionPromise = DatabaseConnection.connect();

const initializeCommand = () => {
    let commandRan = false;
    commander
        .version('0.8.15');

    commander
        .command('webserver:start')
        .description('Start the redirect webserver')
        .action(() => {
            commandRan = true;

            Webserver.startWebserver();
        });

    commander
        .command('routes:list')
        .action(() => {
            commandRan = true;

            CliInterface
                .listRoutes()
                .then((routesList: RedirectInterface[]) => {
                    if (!routesList.length) {
                        Logger.cliOutput('');
                        Logger.cliOutput('No routes found');
                    } else {
                        Logger.cliOutput('');
                        Logger.cliOutput('Available routes:');
                        Logger.cliOutput('');

                        const outputTable = new Table();

                        _.forEach(routesList, (singleRoute) => {
                            outputTable.cell('Source URL', singleRoute.sourceUrl.join('/'));
                            outputTable.cell('Target URL', singleRoute.targetUrl);
                            outputTable.newRow();
                        });
                        Logger.cliOutput(outputTable.toString());
                    }
                    return;
                }).then(() => {
                    Logger.debug('Exiting cli');
                    process.exit(0);
                }).catch(Logger.error);

        });

    commander
        .command('routes:add <localRoute> <remoteUrl>')
        .action((localRoute: string, remoteUrl: string) => {
            commandRan = true;

            CliInterface
                .addRoute(localRoute, remoteUrl)
                .then(() => {
                    Logger.debug('Exiting cli');
                    process.exit(0);
                });
        });

    commander
        .command('routes:delete <localRoute>')
        .action((localRoute: string) => {
            commandRan = true;

            CliInterface
                .deleteRoute(localRoute)
                .then(() => {
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

dbConnectionPromise.then(() => {
    Logger.debug('Exiting cli');
    initializeCommand();
}).catch((data: any) => {
    Logger.error(data);
    process.exit(1);
});
