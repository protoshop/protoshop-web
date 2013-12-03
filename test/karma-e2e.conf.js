var sharedConfig = require('./karma-shared.conf');

module.exports = function(config) {
  var conf = sharedConfig();

  conf.files = conf.files.concat([
    //test files
    './test/e2e/*.js',
    './test/e2e/**/*.js'
  ]);

  // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
  conf.logLevel = config.LOG_INFO;

  conf.proxies = {
    '/': 'http://localhost:9999/'
  };

  conf.frameworks = ['ng-scenario'];

  conf.port = 9878;

  config.set(conf);
  return conf;
};
