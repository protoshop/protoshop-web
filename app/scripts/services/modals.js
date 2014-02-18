'use strict';

angular.module('toHELL')
  .factory('dialogShare', ['btfModal', function(Modal){
    return Modal({
      controller: 'DialogShareCtrl',
      controllerAs: 'modal',
      templateUrl: 'partials/dialog-share.html'
    })
  }])
  .controller('DialogShareCtrl', ['dialogShare', function(dialogShare){
    this.closeMe = dialogShare.deactivate;
  }]);