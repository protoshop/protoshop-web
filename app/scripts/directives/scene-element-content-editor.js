'use strict';

angular.module('toHELL')

/**
 * Element Content Editor
 */

.directive('elementContentEditor', function ($document) {
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
    link: function (scope, el) {
      scope.elem = scope.elemData();


      /**
       * 当鼠标点下时，
       * 记录控件和鼠标指针的当前位置，开始监听拖拽相关事件
       */

      function bindDragHandler($ev) {

        // 不接受非左键点击
        if ($ev.which !== 1) {
          return;
        }

        // 选中此控件
//        scope.selectElement(scope.elem);
//        scope.$apply();

        // 记录控件和鼠标初始位置
        scope.origin = {
          posx: scope.elem.posX,
          posy: scope.elem.posY,
          mousex: $ev.clientX,
          mousey: $ev.clientY
        };

        // 绑定
        $document.on('mousemove', updateElemPos);
        $document.on('mouseup', unbindDragEvents);

        $ev.stopPropagation();

      }

      el.on('mousedown', bindDragHandler);

      /**
       * 根据拖拽事件，更新控件的位置信息
       */

      function updateElemPos($ev) {

        // 设置鼠标样式
        $document.find('body').css('cursor', 'move');

        // 拖拽范围
        var maxX = scope.$parent.size.width - scope.elem.width;
        var minX = 0;
        var maxY = scope.$parent.size.height - scope.elem.height;
        var minY = 0;

        // 
        if (scope.elem.wrapperSize) {
          scope.elem.posX = (scope.origin.posx + $ev.clientX - scope.origin.mousex).crop(99999, minX);
          scope.elem.posY = (scope.origin.posy + $ev.clientY - scope.origin.mousey).crop(99999, minY);
        } else {
          scope.elem.posX = (scope.origin.posx + $ev.clientX - scope.origin.mousex).crop(maxX, minX);
          scope.elem.posY = (scope.origin.posy + $ev.clientY - scope.origin.mousey).crop(maxY, minY);
        }

        scope.$apply();
      }

      /**
       * 清理拖拽相关事件
       */

      function unbindDragEvents() {

        // 清除鼠标样式
        $document.find('body').css('cursor', 'auto');

        $document.unbind('mousemove', updateElemPos);
        $document.unbind('mouseup', unbindDragEvents);
      }

      // 阻止控件元素上的点击事件冒泡
      el.on('click', function (event) { event.stopPropagation(); });
    }
  };
});
