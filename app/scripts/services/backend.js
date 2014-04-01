'use strict';

angular.module('toHELL')
.factory('backendService', [ '$http', '$location', function ($http, $location) {

  var isBeta = /(beta|:9999)/.test(window.location.href);

  return {
    host: 'http://protoshop.ctripqa.com/ProtoShop/',
    pkgDir: isBeta ? 'http://wxddb1.qa.nt.ctripcorp.com/betapackages/'
    : 'http://wxddb1.qa.nt.ctripcorp.com/packages/',
    apiHost: isBeta ? 'http://protoshop.ctripqa.com/ProtoShop/'
    : 'http://protoshop.ctripqa.com/ProtoShop/',
    errLogger: function (res) {
      var errDesc = '[ERR:' + res.code + '] ' + res.message;
      console.log('Login Error: ', errDesc, res);
    }
  }
}]);
