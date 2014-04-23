'use strict';

angular.module('toHELL')

/**
 * Element Rect Handler（界面元素拖拽控件） in scene editor
 */

.directive('elementHandler', function ($document) {
  return {
    restrict: 'AE',
    replace: 'true',
    scope: {
      elemData: '='
    },
    templateUrl: 'partials/scene-element-handler.html',
    link: function (scope, el) {

      el.on('mousedown', function ($event) {

        // 不接受非左键点击
        if ($event.which !== 1) {
          return;
        }

        // 记录初始状态
        scope.origin = {
          elemx: scope.elemData.posX,
          elemy: scope.elemData.posY,
          elemw: scope.elemData.width,
          elemh: scope.elemData.height,
          mousex: $event.clientX,
          mousey: $event.clientY
        };

        scope.direction = $event.target.dataset.handle;

        // 绑定
        $document.on('mousemove', updateElemRect);
        $document.on('mouseup', unbindDragEvents);

        $event.stopPropagation();

      });

      /**
       * 根据拖拽事件更新元素宽高（以及位置）
       * @param $ev
       */

      function updateElemRect($ev) {

        var deltaX = $ev.clientX - scope.origin.mousex;
        var deltaY = $ev.clientY - scope.origin.mousey;

        switch (scope.direction) {
        case 'up':
          deltaY = deltaY.crop(0 - scope.origin.elemy, scope.origin.elemh);
          scope.elemData.posY = scope.origin.elemy + deltaY;
          scope.elemData.height = scope.origin.elemh - deltaY;
          break;
        case 'down':
          scope.elemData.height = (scope.origin.elemh + deltaY).crop(0, scope.$parent.stage.height - scope.origin.elemy);
          break;
        case 'left':
          deltaX = deltaX.crop(0 - scope.origin.elemx, scope.origin.elemw);
          scope.elemData.posX = scope.origin.elemx + deltaX;
          scope.elemData.width = scope.origin.elemw - deltaX;
          break;
        case 'right':
          scope.elemData.width = (scope.origin.elemw + deltaX).crop(0, scope.$parent.stage.width - scope.origin.elemx);
        }

        scope.$apply();
      }

      /**
       * 清理拖拽相关事件
       */

      function unbindDragEvents() {
        $document.unbind('mousemove', updateElemRect);
        $document.unbind('mouseup', unbindDragEvents);
      }

      // 阻止控件元素上的点击事件冒泡
      el.on('click', function (event) { event.stopPropagation(); });

    }
  };
});
