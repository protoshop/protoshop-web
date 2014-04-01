'use strict';

angular.module('toHELL')
.factory('backendService', function ($http, accountService) {

  var isBeta = /(beta|:9999)/.test(window.location.href);

  function errLogger(res, infoPrefix) {
    var errInfo = '[ERR:' + res.code + '] ' + res.message;
    console.log(infoPrefix || 'Backend Service Error: ', errInfo, res);
    notifyService.error(res.message);
  }

  return {
    apiHost: isBeta
    ? 'http://protoshop.ctripqa.com/ProtoShop/'
    : 'http://protoshop.ctripqa.com/ProtoShop/',
    pkgDir: isBeta
    ? 'http://wxddb1.qa.nt.ctripcorp.com/betapackages/'
    : 'http://wxddb1.qa.nt.ctripcorp.com/packages/',
    errLogger: errLogger,

    getProjectList: function (callback) {

      var user = accountService.getLoggedInUser();

      // $http.get('/api/package/list.json')
      $http.get(this.apiHost + 'fetchlist/?device=&token=' + user.token)
      .success(function (res) {

        switch (res.status) {

        case 0:
          callback && callback(res.result);
          break;

        default:
          errLogger(res);
        }
      })
      .error(errLogger);
    }

  }
});
