'use strict';

angular.module('toHELL')
  .factory('dialogShare', ['btfModal', function(Modal){
    return Modal({
      controller: 'DialogShareCtrl',
      controllerAs: 'modal',
      templateUrl: 'partials/dialog-share.html'
    })
  }])
  .controller('DialogShareCtrl', ['dialogShare', '$scope', '$http', function(dialogShare, $scope, $http){
    this.closeMe = dialogShare.deactivate;
    $scope.fellows = [];
    $scope.lookupFellows = function($event){
      console.log($event);
    };
    console.log($scope, this);
  }]);