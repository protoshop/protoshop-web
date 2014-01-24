'use strict';

angular.module('toHELL')
  .controller('RegisterCTRL', ['$scope', '$location', '$http', 'GLOBAL', 'loginService',
    function ($scope, $location, $http, GLOBAL, loginService) {
      $scope.doSignup = function () {
        $http.post(GLOBAL.apiHost + 'register/', $scope.user)
          .success(function (res) {
            switch (res.status) {
            case '1':
              loginService.doLogin($scope.user, function () {
                $location.path('/list/');
              });
              break;
            default:
              var errDesc = GLOBAL.errDesc[res.error_code] || '未知错误';
              alert(errDesc);
              console.log('Signup Error: ', errDesc, res);
            }
          })
          .error(GLOBAL.errLogger);
      }
    }]);