'use strict';

angular.module('toHELL').factory('loginService', [ '$http', 'GLOBAL', function ($http, GLOBAL) {
  var loggedInUser;
  return {
    isLoggedIn: function(){
      return !!loggedInUser;
    },
    doLogin: function(account, callback, errCallback){
      $http.post(GLOBAL.apiHost + 'login/', account)
        .success(function (res) {
          switch (res.status) {
          case '1':
            loggedInUser = res.result;
            callback && callback(res.result);
            break;
          default:
            console.log('Login Error:', res);
            errCallback && errCallback(res);
          }
        })
        .error(GLOBAL.errLogger);
    },
    getLoggedInUser: function(){
      return this.isLoggedIn() ? loggedInUser : false;
    }
  }
}]);