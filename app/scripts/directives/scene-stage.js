'use strict';

angular.module('toHELL')
.directive('sceneStage', function ($rootScope, uilib) {
  return {
    restrict: 'A',
    replace: true,
    templateUrl: 'partials/scene-stage.html',
    scope: true,
    link: function (scope, el) {

      scope.size = {
        width: el.width(),
        height: el.height()
      };

      // Handle Event 'scene.addElement'
      scope.$on('scene.addElement', function (event, args) {
        uilib.then(function (lib) {
          var newElement = JSON.parse(JSON.stringify(lib.data[args.type].init));

          newElement.posX = (args.posx - 60).crop(0, 200);
          newElement.posY = (args.posy - 22).crop(0, 436);

          var host = args.wrapper.elem || scope.editStat.selectedScene;

          host.elements = host.elements || [];
          host.elements.push(newElement);
        });
      });

      scope.selectElement = function (elemObj) {
        scope.editStat.selectedElement = elemObj;
      };

    }
  };
});
