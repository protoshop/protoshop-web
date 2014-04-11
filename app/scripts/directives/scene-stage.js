'use strict';

angular.module('toHELL')
.directive('sceneStage', ['$rootScope', function ($rootScope) {
  return {
    restrict: 'A',
    replace: true,
    templateUrl: 'partials/scene-stage.html',
    scope: true,
    link: function (scope, el) {

      // Scene 的编辑区的基础信息
      scope.stage = {
        width: el.width(),
        height: el.height()
      };

      // Handle Event 'drop'
      var $el = angular.element(el);
      $el.on('dragover', function (ev) {ev.preventDefault();});
      $el.on('drop', function (ev) {
        var newElemType = ev.originalEvent.dataTransfer.getData('type');
        if (newElemType) {
          ev.stopPropagation();
          $rootScope.$broadcast('scene.addElement', {
            type: newElemType,
            posx: ev.originalEvent.clientX - ev.target.offsetLeft + ev.target.scrollLeft,
            posy: ev.originalEvent.clientY - ev.target.offsetTop + ev.target.scrollTop
          });
        }
      });

      // Handle Event 'scene.addElement'
      scope.$on('scene.addElement', function (event, args) {
        var newElement = {
          type: args.type,
          posX: (args.posx - 60).crop(0, 200),
          posY: (args.posy - 22).crop(0, 436),
          width: 120,
          height: 44,
          actions: []
        };
        event.currentScope.editStat.selectedScene.elements.push(newElement);
        event.currentScope.$apply();
      });

      scope.selectElement = function (elemObj) {
        scope.editStat.selectedElement = elemObj;
      };

    }
  };
}]);
