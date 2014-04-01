'use strict';

angular.module('toHELL')
.controller('LoginCTRL', ['$scope', '$location', '$http', 'accountService',
  function ($scope, $location, $http, account) {

    // Check if user logged in.
    if (account.isLoggedIn()) {
      return $location.path('list/');
    }

    // Do the login operation.
    $scope.doLogin = function () {
      
      var userData = {
        email: $scope.loginData.email,
        passwd: $scope.loginData.passwd
      };

      account.login(userData, function () {
        $location.path('list/');
      });

    };
  }
]);
