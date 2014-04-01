'use strict';

angular.module('toHELL')
.controller('RegisterCTRL', function ($scope, $location, backendService, accountService) {
  $scope.doSignup = function () {

    accountService.signup($scope.user, function () {
      // 注册成功后
      // 以用户原始输入的账号信息进行自动登陆
      accountService.login($scope.user, function () {
        $location.path('/list/');
      });
    });

  };
});
