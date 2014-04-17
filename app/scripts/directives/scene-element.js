'use strict';

angular.module('toHELL')

/**
 * Element（界面元素控件） in scene editor
 */

.directive('sceneElement', function ($document, $q, uilibs, uiprops) {
  return {
    restrict: 'AE',
    templateUrl: 'partials/scene-element.html',
    scope: true,
    link: function (scope, el) {

      // Scene 的编辑区的基础环境信息。 TODO：stage 的宽和高应该取自工程配置
      scope.stage = {
        width: el.parent().width(),
        height: el.parent().height()
      };

      // 登记此控件可以有的属性集合
      $q.all([uilibs, uiprops]).then(function (res) {
        scope.props = {};
        var cfg = res[0].data[scope.elem.type].props;
        for (var p in cfg) {
          if (cfg.hasOwnProperty(p)) {
            scope.props[p] = res[1].data[p];
          }
        }
      });

      scope.scenes = scope.package.scenes;
      scope.defaults = {
        sceneBackground: 'images/dummy-scene-thumb.png'
      };

      /**
       * 当鼠标点下时，
       * 记录控件和鼠标指针的当前位置，开始监听拖拽相关事件
       */

      el.on('mousedown', function (event) {

        // 不接受非左键点击
        if (event.which !== 1) {
          return;
        }

        // 选中此控件
        scope.selectElement(scope.elem);
        scope.$apply();

        // 记录控件和鼠标初始位置
        scope.origin = {
          posx: scope.elem.posX,
          posy: scope.elem.posY,
          mousex: event.clientX,
          mousey: event.clientY
        };

        // 绑定
        $document.on('mousemove', updateElemPos);
        $document.on('mouseup', unbindDragEvents);

      });

      /**
       * 根据拖拽事件，更新控件的位置信息
       */

      function updateElemPos($ev) {

        // 设置鼠标样式
        $document.find('body').css('cursor', 'move');

        // 拖拽范围
        var maxX = scope.stage.width - scope.elem.width;
        var minX = 0;
        var maxY = scope.stage.height - scope.elem.height;
        var minY = 0;

        scope.elem.posX = (scope.origin.posx + $ev.clientX - scope.origin.mousex).crop(maxX, minX);
        scope.elem.posY = (scope.origin.posy + $ev.clientY - scope.origin.mousey).crop(maxY, minY);

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
})

.directive('elementHandler', function ($document) {
  return {
    restrict: 'AE',
    scope: true,
    templateUrl: 'partials/scene-element-handler.html',
    link: function (scope, el) {

      el.on('mousedown', function ($event) {

        // 不接受非左键点击
        if ($event.which !== 1) {
          return;
        }

        // 记录初始状态
        scope.origin = {
          elemx: scope.$parent.elem.posX,
          elemy: scope.$parent.elem.posY,
          elemw: scope.$parent.elem.width,
          elemh: scope.$parent.elem.height,
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
          scope.$parent.elem.posY = scope.origin.elemy + deltaY;
          scope.$parent.elem.height = scope.origin.elemh - deltaY;
          break;
        case 'down':
          scope.$parent.elem.height = scope.origin.elemh + deltaY;
          break;
        case 'left':
          scope.$parent.elem.posX = scope.origin.elemx + deltaX;
          scope.$parent.elem.width = scope.origin.elemw - deltaX;
          break;
        case 'right':
          scope.$parent.elem.width = scope.origin.elemw + deltaX;
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
