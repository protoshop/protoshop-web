'use strict';

angular.module('toHELL')
.directive('sidebarlibs', function (uilib) {
  return {
    restrict: 'E',
    replace: true,
    templateUrl: 'partials/sidebar-libs.html',
    link: function (scope) {
      scope.dragComponent = function (ev) {
        console.log(scope);
        var type = ev.target.getAttribute('data-type');
        var dt = ev.originalEvent.dataTransfer;
        dt.setData('type', type);
      };

      // load ui component libs
      uilib.then(function (lib) {
        scope.libs = lib.data;
      });

    }
  };
});
