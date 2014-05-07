'use strict';

angular.module('toHELL')

/**
 * Element（界面元素控件） in scene editor
 */

.directive('elementView', function () {
  return {
    restrict: 'AE',
    replace: true,
    templateUrl: 'partials/scene-element-view.html'
  };
});
