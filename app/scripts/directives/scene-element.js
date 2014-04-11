'use strict';

angular.module('toHELL')

/**
 * Element（界面元素控件） in scene editor
 */

.directive('sceneElement', function ($document) {
  return {
    restrict: 'AE',
    templateUrl: 'partials/scene-element.html',
    scope: true,
    link: function (scope, el) {

      // Scene 的编辑区的基础信息
      scope.stage = {
        width: el.parent().width(),
        height: el.parent().height()
      };

      scope.scenes = scope.package.scenes;
      scope.defaults = {
        sceneBackground: 'images/dummy-scene-thumb.png'
      };

      /**
       * 渲染当前选中Action所对应的Scene背景图
       * @func renderThumbBackground
       * @return {String} 如果存在相应Action及对应Scene背景图，则返回该背景图的相对路径，否则返回一个默认背景图的相对路径
       * @private
       */
      scope.renderThumbBackground = function () {
        var defaultOne = scope.defaults.sceneBackground;
        var action = scope.editStat.selectedAction;
        if (!action) {
          return defaultOne;
        }

        var scene = scope.findSceneById(action.target);

        if (!scene) {
          return defaultOne;
        }

        var target = scene.background;
        return (target === '' || !target) ? defaultOne : target;
      };

      scope.gotoSignStyle = {
        top: '',
        right: ''
      };
      scope.gotoLineStyle = {
        width: '264px'
      };

      /**
       * 当鼠标点下时，
       * 记录控件和鼠标指针的当前位置，开始监听拖拽相关事件
       */

      scope.origin = {
        posx: 0,
        posy: 0,
        mousex: 0,
        mousey: 0
      };

      el.on('mousedown', function (event) {

        // 不接受非左键点击
        if (event.which !== 1) {
          return;
        }

        // 选中此控件
        scope.selectElement(scope.elem);
        scope.$apply();

        // 记录控件和鼠标初始位置
        scope.origin.posx = scope.elem.posX;
        scope.origin.posy = scope.elem.posY;
        scope.origin.mousex = event.clientX;
        scope.origin.mousey = event.clientY;

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

.directive('editorHotspotHandle', function ($document) {
  var lastCursor = '';
  return {
    restrict: 'AE',
    transclude: true,
    templateUrl: 'partials/hotspothandle.html',
    link: function (scope) {
      var expanderStack = {
        expanderMovingTarget: null,
        expanderMovingStart: {
          x: 0,
          y: 0
        },
        expanderMovingOffset: {
          x: 0,
          y: 0
        },
        hotspotPos: {
          x: 0,
          y: 0
        },
        hotspot: {
          width: 0,
          height: 0
        },
        expanderIndex: null
      };

      /**
       * 元素缩放触头在鼠标按下时触发此函数
       * @func onExpanderDown
       * @param {Element} ele - 元素对象
       * @param {number} pos - 触头的索引，用来区分是哪个触头。从左开始顺时针依次为1、2、3、4
       * @param {event} $event - 鼠标事件
       * @private
       */
      scope.onExpanderDown = function (ele, pos, $event) {
        if ($event.which !== 1) {// 不接受非左键点击
          return;
        }
        $document.on('mousemove', scope.onExpanderMove);
        $document.on('mouseup', scope.onExpanderUp);
        var sT = expanderStack;
        sT.expanderIndex = pos;
        sT.expanderMovingTarget = ele;
        sT.expanderMovingStart.x = $event.clientX;
        sT.expanderMovingStart.y = $event.clientY;
        sT.hotspotPos.x = parseInt(ele.posX, 10);
        sT.hotspotPos.y = parseInt(ele.posY, 10);
        sT.hotspot.width = parseInt(ele.width, 10);
        sT.hotspot.height = parseInt(ele.height, 10);
        sT.expanderMovingOffset.y = parseInt(sT.expanderMovingTarget.height, 10); // 小心单位
        sT.expanderMovingOffset.x = parseInt(sT.expanderMovingTarget.width, 10);
        var jBody = $document.find('body');
        var cursor = '';
        lastCursor = jBody.css('cursor');
        switch (pos) {
        case 1:
          cursor = 'w-resize';
          break;
        case 2:
          cursor = 'n-resize';
          break;
        case 3:
          cursor = 'e-resize';
          break;
        case 4:
          cursor = 's-resize';
          break;
        default:
          break;
        }
        jBody.css({
          cursor: cursor
        });
      };

      /**
       * 元素缩放触头在鼠标松开时触发此函数
       * @func onExpanderUp
       * @private
       */
      scope.onExpanderUp = function () {
        var sT = expanderStack;
        sT.expanderMovingTarget = null;
        $document.find('body').css('cursor', lastCursor);
        scope.$apply();
      };

      /**
       * 元素缩放触头在鼠标移动时触发此函数
       * @func onExpanderMove
       * @param {event} $event - 鼠标事件
       * @private
       */
      scope.onExpanderMove = function ($event) {
        var eT = expanderStack;
        if (eT.expanderMovingTarget !== null) {
          var target = eT.expanderMovingTarget;
          var xT = eT.expanderMovingOffset.x + $event.clientX - eT.expanderMovingStart.x;
          var yT = eT.expanderMovingOffset.y + $event.clientY - eT.expanderMovingStart.y;
          // 计算实际的移动距离
          var deltaY = eT.hotspot.height - yT;
          var deltaX = eT.hotspot.width - xT;

          switch (eT.expanderIndex) {
            // 由于元素的定位实际是左上角的定位，因此左边侧和上边侧的变动，需要同时移动元素来保持整体的静止
          case 1:
            // 防止因无法resize而导致的move
            if (eT.hotspotPos.x - deltaX < eT.hotspotPos.x + eT.hotspot.width) {
              scope.moveHotspotTo(target, eT.hotspotPos.x - deltaX, eT.hotspotPos.y);
            }
            // 防止因无法move而导致的resize
            // FIXME: 注意，这两种判断都不是精确的，可能因为鼠标事件精确性发生一定的差错
            if (parseInt(target.posX, 10) > 0 || deltaX < 0) {
              scope.resizeHotspotTo(target, eT.hotspot.width + deltaX, eT.hotspot.height);
            }
            break;
          case 2:
            if (eT.hotspotPos.y - deltaY < eT.hotspotPos.y + eT.hotspot.height) {
              scope.moveHotspotTo(target, eT.hotspotPos.x, eT.hotspotPos.y - deltaY);
            }
            if (parseInt(target.posY, 10) > 0 || deltaY < 0) {
              scope.resizeHotspotTo(target, eT.hotspot.width, eT.hotspot.height + deltaY);
            }
            break;
            // 而右边侧与下边侧的移动则不会对整体位置造成影响
          case 3:
            scope.resizeHotspotTo(target, eT.hotspot.width - deltaX, eT.hotspot.height);
            break;
          case 4:
            scope.resizeHotspotTo(target, eT.hotspot.width, eT.hotspot.height - deltaY);
            break;
          default:
            break;
          }
          scope.$apply();
        }
      };
    }
  };
});
