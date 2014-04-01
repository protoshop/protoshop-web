'use strict';

angular.module('toHELL')
.factory('accountService', function ($http, $location, backendService, notifyService) {

  var loggedInUser;

  function errLogger(res, infoPrefix) {
    var errData = '[ERR:' + res.code + '] ' + res.message;
    console.log(infoPrefix || 'Account Service Error: ', errData, res);
    notifyService.error(res.message);
  }

  return {

    /**
     * 注册新用户账号
     * @param userData
     * @param callback
     * @param errCallback
     */
    signup: function (userData, callback, errCallback) {

      // 将密码做 MD5 转换
      var data = {
        email: userData.email,
        passwd: V.Security.md5(userData.passwd),
        nickname: userData.nickname
      };

      // 注册
      $http.post(backendService.apiHost + 'register/', data)
      .success(function (res) {
        switch (res.status) {
        case 0:
          callback && callback();
          break;
        default:
          errLogger(res);
          errCallback && errCallback();
        }
      })
      .error(backendService.errLogger);
    },

    /**
     * 检查当前状态是否已经登陆
     * @returns {Boolean}
     */
    isLoggedIn: function () {
      loggedInUser = loggedInUser || JSON.parse(localStorage.getItem('loggedInUser'));
      return !!loggedInUser;
    },

    /**
     * 获取当前已经登陆的用户信息
     * @returns {Object|Boolean}
     */
    getLoggedInUser: function () {
      return this.isLoggedIn() ? loggedInUser : false;
    },

    /**
     * 登陆账号
     * @param account
     * @param callback
     * @param errCallback
     */
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
          errLogger(res);
          errCallback && errCallback(res);
        }
      })
      .error(backendService.errLogger);
    },

    /**
     * 登出账号
     * @param callback
     */
    logout: function (callback) {
      loggedInUser = null;
      localStorage.removeItem('loggedInUser');
      $location.path('/');
      callback && callback();
    }
  };
})
.factory('loginService', function (accountService) {
  return accountService
});