var sharedConfig = require('./karma-shared.conf');

module.exports = function(config) {
  var conf = sharedConfig();

  conf.files = conf.files.concat([
    //extra testing code
    './app/bower_components/angular-mocks/angular-mocks.js',
    './node_modules/ng-midway-tester/src/ngMidwayTester.js',

    //test files
    './test/midway/**/*.js'
  ]);

  // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
  conf.logLevel = config.LOG_INFO;

  conf.proxies = {
    '/': 'http://localhost:9999/'
  };

  conf.port = 9877;

  config.set(conf);
  return conf;
};
