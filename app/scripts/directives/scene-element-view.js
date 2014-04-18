'use strict';

angular.module('toHELL')

/**
 * Element（界面元素控件） in scene editor
 */

.directive('elementView', function(){
  return {
    restrict: 'AE',
    replace: true,
    scope: {
      elemData: '&elemData'
    },
    templateUrl: 'partials/scene-element-view.html',
    link: function(scope){
      scope.elem = scope.elemData();
    }
  };
});
