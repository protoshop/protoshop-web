'use strict';

angular.module('toHELL')
.directive('sceneStage', function ($rootScope, uilib, uiprops) {
  return {
    restrict: 'A',
    replace: true,
    templateUrl: 'partials/scene-stage.html',
    scope: true,
    link: function (scope, el) {

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

      // For enum props config
      uiprops.then(function (props) {
        scope.uiprops = props.data;
      });

      // Handle Event 'scene.addElement'
      scope.$on('scene.addElement', function (event, args) {
        uilib.then(function (lib) {
          var newElement = JSON.parse(JSON.stringify(lib.data[args.type].init));
          newElement.posX = (args.posx - 60).crop(0, 200);
          newElement.posY = (args.posy - 22).crop(0, 436);
          
          event.currentScope.editStat.selectedScene.elements.push(newElement);
        });
      });

      scope.selectElement = function (elemObj) {
        scope.editStat.selectedElement = elemObj;
      };

    }
  };
});
