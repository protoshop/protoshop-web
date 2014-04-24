'use strict';

angular.module('toHELL')

/**
 * Element Editor in scene editor
 */

.directive('elementEdit', function () {
  return {
    restrict: 'AE',
    replace: true,
    scope: {
      elemData: '&elemData'
    },
    templateUrl: 'partials/scene-element-edit.html',
    controller: function ($scope, uiprops) {
      
      $scope.package = $scope.$parent.package;

      // For enum props config
      uiprops.then(function (props) {
        $scope.props = props.data;
      });

    },
    link: function (scope) {
      scope.elem = scope.elemData();
    }
  };
});
