'use strict';

angular.module('toHELL').service('ENV', function () {

  var env = 'unknown';
  
  if (/debug|localhost/.test(window.location.href)) {
    env = 'debug';
  } else if (/ctripqa/.test(window.location.href)) {
    env = 'ctqa';
  } else {
    env = 'open';
  }

  var apiHosts = {
<<<<<<< HEAD
    // debug: 'http://10.2.254.48/debugProtoShop/',
    debug: 'http://api.protoshop.io/',
=======
    //debug: 'http://10.2.254.48/debugProtoShop/',
    debug : 'http://api.protoshop.io/',
>>>>>>> 5263d9c1f64c706f0aebcd557cccfc041c6e1a21
    ctqa: 'http://10.2.254.48/ProtoShop/',
    open: 'http://api.protoshop.io/'
  };
  
  var pkgRoots = {
<<<<<<< HEAD
    // debug: 'http://10.2.254.48/debugpackages/',
     debug: 'http://protoshop.io/packages/',

=======
    //debug: 'http://10.2.254.48/debugpackages/',
    debug: 'http://protoshop.io/packages/',
>>>>>>> 5263d9c1f64c706f0aebcd557cccfc041c6e1a21
    ctqa: 'http://10.2.254.48/packages/',
    open: 'http://protoshop.io/packages/'
  };

  return {
    env: env,
    apiHost: apiHosts[env],
    pkgRoot: pkgRoots[env]
  }
});