'use strict';

angular.module('toHELL')
  .controller('LoginCTRL', ['$scope', '$location', '$http', 'GLOBAL', 'loginService',
    function ($scope, $location, $http, GLOBAL, loginService) {

      // Check if user logged in.
      if (GLOBAL.loggedInUser) {
        return $location.path('list/');
      }

      // Do the login operation.
      $scope.doSignin = function () {

        loginService.doLogin($scope.loginData, function(){
          $location.path('list/');
        });

      };
    }]);