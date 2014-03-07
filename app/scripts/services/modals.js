'use strict';

angular.module('toHELL')
  .factory('dialogShare', ['btfModal', function(Modal){
    return Modal({
      controller: 'DialogShareCtrl',
      controllerAs: 'modal',
      templateUrl: 'partials/dialog-share.html'
    })
  }])
  .controller('DialogShareCtrl', [
    'dialogShare',
    '$scope',
    'GLOBAL',
    '$http',
    function(dialogShare, $scope, GLOBAL, $http){
      
    this.closeMe = dialogShare.deactivate;
      
    $scope.fellows = [];
    $scope.lookup = '';
    $scope.lookupFellows = function(){
      if($scope.lookup === ''){
        $scope.fellows = [];
      }else{
        $http.get(GLOBAL.apiHost + 'searchUser/?keyword=' + $scope.lookup)
          .success(function(res){
            $scope.fellows = res.results;
          });
      }
    };
      
  }]);