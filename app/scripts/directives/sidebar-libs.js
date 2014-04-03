'use strict';

angular.module('toHELL')
.directive('sidebarlibs', function ($rootScope) {
  return {
    restrict: 'E',
    replace: true,
    templateUrl: 'partials/sidebar-libs.html',
    link: function (scope, el) {

      // bind drag events
      var lis = angular.element(el).find('li');
      lis.on('dragstart', function (ev) {
        var type = this.getAttribute('data-type');
        var dt = ev.originalEvent.dataTransfer;
        dt.setData('type', type);
        $rootScope.$emit('libelem.dragstart');
      });
    }
  };
});
