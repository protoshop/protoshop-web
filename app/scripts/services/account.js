'use strict';

angular.module('toHELL')
.factory('loginService', function () {
  return {
    isLoggedIn: function () {return false}
  }
})
.factory('accountService', function ($http, $location, backendService, notifyService) {

  var loggedInUser;

  return {

    isLoggedIn: function () {
      loggedInUser = loggedInUser || JSON.parse(localStorage.getItem('loggedInUser'));
      return !!loggedInUser;
    },

    getLoggedInUser: function () {
      return this.isLoggedIn() ? loggedInUser : false;
    },

    login: function (account, callback, errCallback) {

      // Trasform password to hash
      account.passwd = V.Security.md5(account.passwd);

      // Login
      $http.post(backendService.apiHost + 'login/', account)
      .success(function (res) {
        switch (res.status) {

        case 0:
          // Success
          loggedInUser = res.result[0];
          localStorage.setItem('loggedInUser', JSON.stringify(loggedInUser));
          callback && callback(res.result);
          break;

        default:
          // Else
          var errDesc = '[ERR:' + res.code + '] ' + res.message;
          console.log('Login Error: ', errDesc, res);
          notifyService.error(errDesc);

          errCallback && errCallback(res);
        }
      })
      .error(backendService.errLogger);
    },

    logout: function (callback) {
      loggedInUser = null;
      localStorage.removeItem('loggedInUser');
      $location.path('/');
      callback && callback();
    }
  };
});