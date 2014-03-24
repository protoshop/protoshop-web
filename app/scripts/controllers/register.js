'use strict';

angular.module('toHELL')
.controller('RegisterCTRL', ['$scope', '$location', '$http', 'GLOBAL', 'loginService', 'notifyService',
  function ($scope, $location, $http, GLOBAL, loginService, notifyService) {
    $scope.doSignup = function () {

      // 将密码做 MD5 转换
      var account = {
        email: $scope.user.email,
        passwd: V.Security.md5($scope.user.passwd)
      };

      // 注册
      $http.post(GLOBAL.apiHost + 'register/', account)
      .success(function (res) {
        switch (res.status) {
        case '1':
          // 注册成功后
          // 以用户原始输入的账号信息进行自动登陆
          loginService.doLogin($scope.user, function () {
            $location.path('/list/');
          });
          break;
        default:
          var errDesc = GLOBAL.errDesc[res.error_code] || '未知错误';
          notifyService.error(errDesc);
          console.log('Signup Error: ', errDesc, res);
        }
      })
      .error(GLOBAL.errLogger);
    };
  }
]);
