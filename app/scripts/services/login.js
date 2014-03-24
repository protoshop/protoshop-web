'use strict';

angular.module('toHELL').factory('loginService', [ '$http', 'GLOBAL', '$location', function ($http, GLOBAL, $location) {

  var loggedInUser;

  return {

    isLoggedIn: function () {
      loggedInUser = loggedInUser || JSON.parse(localStorage.getItem('loggedInUser'));
      return !!loggedInUser;
    },

    getLoggedInUser: function () {
      return this.isLoggedIn() ? loggedInUser : false;
    },

    doLogin: function (account, callback, errCallback) {

      // Trasform password to hash
      account.passwd = V.Security.md5(account.passwd);

      // Login
      $http.post(GLOBAL.apiHost + 'login/', account)
      .success(function (res) {
        switch (res.status) {

        case '1':
          // Success
          loggedInUser = res.result;
          localStorage.setItem('loggedInUser', JSON.stringify(loggedInUser));
          callback && callback(res.result);
          break;

        default:
          // Else
          var errDesc = GLOBAL.errDesc[res.error_code] || '未知错误';
          console.log('Login Error: ', errDesc, res);
          errCallback && errCallback(res);
        }
      })
      .error(GLOBAL.errLogger);
    },

    doLogout: function (callback) {
      loggedInUser = false;
      localStorage.removeItem('loggedInUser');
      $location.path('/');
      callback && callback();
    }
  };
}]);