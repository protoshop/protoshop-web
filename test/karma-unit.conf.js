var sharedConfig = require('./karma-shared.conf');

module.exports = function(config) {
  var conf = sharedConfig();

  conf.files = conf.files.concat([
    //extra testing code
    './app/bower_components/angular-mocks/angular-mocks.js',
    'app/scripts/services/package.js',
    'app/scripts/services/scene.js',
    'app/scripts/services/element.js',
    'app/scripts/services/action.js',
    'app/scripts/services/notify.js',
    'app/scripts/directives/directives.js',

    //test files
    './test/unit/**/*.js'
  ]);

  // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
  conf.logLevel = config.LOG_INFO;

  config.set(conf);
  return conf;
};
