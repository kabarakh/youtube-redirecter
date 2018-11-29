var yargs = require('yargs');
var Webserver = require('./Webserver/Webserver');
var CliInterface = require('./Cli/CliInterface');

var initializeCommands = function () {
  yargs.usage(
      '$0 <cmd> [args]')
    .command('route:add <localRoute> <remoteUrl>',
      'Add a route to redirect',
      function (yargs) {
        yargs.positional('localRoute', {
            type: 'string',
            describe: 'the local route, e.g. /pls/bl2'
          }),
          yargs.positional('remoteUrl', {
            type: 'string',
            describe: 'the remote url, e.g. https://www.youtube.com/watch?v=ok2NiHhyjDI&list=PLamysY4y7pDBNCV6TcPzCXWQkV_nipgZd'
          })
      },
      function (argv) {
        // todo: build this
        CliInterface.addRoute(argv.localRoute, argv.remoteUrl);
      })
    .command(
      'webserver:start',
      'Start the redirect webserver',
      function () {},
      function () {
        Webserver.startWebserver();
      })
    .help()
    .argv
};


var dbConnectionPromise = require('./Boostrapping/DatabaseConnection');
dbConnectionPromise.then(function () {
  console.log('connected to database');
  initializeCommands();
}).catch(function (data) {
  console.log(data);
  process.exit(1);
});


