'use strict';

angular.module('toHELL')
  .controller('LoginCTRL', ['$scope', '$location', 'GLOBAL',
    function ($scope, $location, GLOBAL) {
      $scope.doSignin = function(){
        console.log(1);
        $location.path('list/');
      }
    }]);