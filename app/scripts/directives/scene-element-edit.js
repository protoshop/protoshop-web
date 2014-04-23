'use strict';

angular.module('toHELL')

/**
 * Element Editor in scene editor
 */

.directive('elementEdit', function(){
  return {
    restrict: 'AE',
    replace: true,
    scope: {
      elemData: '&elemData'
    },
    templateUrl: 'partials/scene-element-edit.html',
    link: function(scope){
      scope.elem = scope.elemData();
    }
  };
});
