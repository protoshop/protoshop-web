'use strict';

angular.module('toHELL')
.directive('sceneStage', ['$rootScope', function ($rootScope) {
  return {
    restrict: 'A',
    replace: true,
    templateUrl: 'partials/scene-stage.html',
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

      // Handle Event 'scene.addElement'
      scope.$on('scene.addElement', function (event, args) {
        var newElement = {
          type: args.type,
          posX: ruleNumber(args.posx - 60,0,200),
          posY: ruleNumber(args.posy - 22,0,436),
          width: 120,
          height: 44,
          actions: []
        };
        event.currentScope.editStat.selectedScene.elements.push(newElement);
        event.currentScope.$apply();
      });

      /**
       * 功能函数：返回不超过 low 到 high 范围的 X
       * 
       * @param {Number} X 处理目标
       * @param {Number} low 允许的最小值
       * @param {Number} high 允许的最大值
       * @returns {Number}
       */
      function ruleNumber(X, low, high) {
        return X < low ? low : X > high ? high : X;
      }
    }
  };
}]);
