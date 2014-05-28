'use strict';

angular.module('toHELL').service('ENV', function () {

  var env = 'unknown';
  
  if (/(beta|:9999|ctripqa)/.test(window.location.href)) {
    env = 'debug';
  } else if (/(beta|:9999|ctripqa)/.test(window.location.href)) {
    env = 'ctqa';
  } else if (/(beta|:9999|ctripqa)/.test(window.location.href)) {
    env = 'open';
  }

  var apiHosts = {
    debug: 'http://10.2.254.48/ProtoShop/',
    ctqa: '',
    open: 'http://api.protoshop.io/'
  };
  
  var pkgRoots = {
    debug: 'http://10.2.254.48/ProtoShop/',
    ctqa: 'http://10.2.254.48/packages/',
    open: 'http://protoshop.io/packages/'
  };

  return {
    env: env,
    apiHost: apiHosts[env],
    pkgRoot: pkgRoots[env]
  }
});