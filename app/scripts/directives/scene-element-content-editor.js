'use strict';

angular.module('toHELL')

/**
 * Element Content Editor
 */

.directive('elementContentEditor', function () {
  return {
    restrict: 'AE',
    replace: true,
    scope: {
      elemData: '&elemData'
    },
    templateUrl: 'partials/scene-element-content.html',
    controller: function ($scope, uiprops) {

      $scope.package = $scope.$parent.package;

      // For enum props config
      uiprops.then(function (props) {
        $scope.props = props.data;
      });

      $scope.editStat = {
        selectedElement: null
      };

    },
    link: function (scope) {
      scope.elem = scope.elemData();
    }
  };
});
