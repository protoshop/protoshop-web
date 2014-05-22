'use strict';

angular.module('toHELL')

/**
 * Parent Element accept adding children.
 */

.directive('parentElement', function ($rootScope) {
  return {
    restrict: 'A',
    link: function (scope, el) {

      // Only 'scrollview' and 'view' can have child elements.
      if (scope.elem && !(scope.elem.type === 'scrollview' || scope.elem.type === 'view')) {
        return;
      }

      // Handle Style
      var $el = angular.element(el);
      $el.on('dragover', function (ev) {
        $el.addClass('dragover');
        ev.stopPropagation();
        ev.preventDefault();
      });
      $el.on('dragleave', function (ev) {
        $el.removeClass('dragover');
        ev.preventDefault();
      });

      // Handle Drop
      $el.on('drop', function (ev) {
        $el.removeClass('dragover');
        var newElemType = ev.originalEvent.dataTransfer.getData('type');
        if (newElemType) {
          ev.stopPropagation();
          var pos = angular.element(ev.target).offset();
          $rootScope.$broadcast('scene.addElement', {
            wrapper: scope,
            type: newElemType,
            posx: ev.originalEvent.clientX - pos.left + ev.target.scrollLeft,
            posy: ev.originalEvent.clientY - pos.top + ev.target.scrollTop
          });
        }
      });

    }
  };
});
