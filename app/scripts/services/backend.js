'use strict';

angular.module('toHELL')
.factory('backendService', [ '$http', '$location', function ($http, $location) {

  var isBeta = /(beta|:9999)/.test(window.location.href);
  
  return {
    host: 'http://wxddb1.qa.nt.ctripcorp.com/',
    pkgHost: isBeta ? 'http://wxddb1.qa.nt.ctripcorp.com/betapackages/'
    : 'http://wxddb1.qa.nt.ctripcorp.com/packages/',
    apiHost: isBeta ? 'http://wxddb1.qa.nt.ctripcorp.com/tohellbeta/'
    : 'http://wxddb1.qa.nt.ctripcorp.com/tohell/'
  }
}]);