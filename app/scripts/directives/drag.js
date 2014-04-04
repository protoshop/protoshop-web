'use strict';

angular.module('toHELL')
.directive('draggable', function () {
  return {
    restrict: 'A',
    link: function (scope, el, attrs) {

      el[0].draggable = true;

      var events = {
        onDragstart: 'dragstart',
        onDragend: 'dragend'
      };

      for (var name in events) {
        if (events.hasOwnProperty(name) && attrs[name]) {
          el.on(events[name], scope[attrs[name]]);
        }
      }

    }
  }
})
.directive('droppable', function () {
  return {
    restrict: 'A',
    link: function (scope, el, attrs) {

      var events = {
        onDragenter: 'dragenter',
        onDragover: 'dragover',
        onDragleave: 'dragleave',
        onDrop: 'drop'
      };

      for (var name in events) {
        if (events.hasOwnProperty(name) && attrs[name]) {
          el.on(events[name], scope[attrs[name]]);
        }
      }

    }
  }
});