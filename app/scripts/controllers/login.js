'use strict';

angular.module('toHELL')
  .controller('LoginCTRL', ['$scope', '$location', '$http', 'GLOBAL',
    function ($scope, $location, $http, GLOBAL) {

      console.log(1);
      // Check if user logged in.
      if (GLOBAL.loggedInUser) {
        return $location.path('list/');
      }

      // Do the login operation.
      $scope.doSignin = function () {

        GLOBAL.loggedInUser = {
          email: 'mail@example.com',
          name: 'godisagirl',
          nickname: 'Giag'
        };
        $location.path('list/');
        return;

        $http.post(GLOBAL.apiHost + 'login/', $scope.user)
          .success(function (res) {
            switch (res.status) {
            case 1:
              GLOBAL.loggedInUser = res.result;
              $location.path('list/');
              break;
            default:
              console.log('Login Error: ' + res);
            }
          })
          .error(GLOBAL.errLogger);
      };
    }]);