'use strict';
(function () {
  var module = angular.module('toHELL');

  module.directive('pxUnit', function() {
    return {
      require: 'ngModel',
      link: function(scope, elm, attrs, ctrl) {
        ctrl.$parsers.unshift(function(viewValue) {
          ctrl.$setValidity('integer', true);
          // NOTE: value considered to be integer only.
          return parseInt(viewValue, 10);
        });
      }
    };
  });

  module.directive('timeUnit', function() {
    return {
      require: 'ngModel',
      link: function(scope, elm, attrs, ctrl) {
        ctrl.$parsers.unshift(function(viewValue) {
          // NOTE: value considered to be float only.
          return parseFloat(viewValue);
        });
      }
    };
  });

  module.directive('editorHotspot', function($document, actionService) {
    return {
      restrict: 'AE',
      transclude: true,
      templateUrl: 'partials/hotspot.html',
      link: function(scope, elm, attrs, ctrl) {
        // console.log(scope, elm, attrs, ctrl);
        /**
         * 返回一个元素的坐标样式信息
         * @func renderHotspotStyle
         * @param {Element} element - 要处理的元素
         * @return {Object} 样式信息，需包含left、top、width、height
         */
        scope.renderHotspotStyle = function (element) {
          return actionService.renderHotspotStyle(element);
        };

        /**
         * 返回线框整体的CSS样式。线框整体指的是包裹线框指示器、线段、属性栏等物件的容器。
         * 通常来说，应当保持scope.editStat.gotoSignStyle与本函数同步。
         * @func renderGotoSignStyle
         * @param {Element} ele - 对应的元素对象
         * @return {Object} 返回样式表对象
         * @todo 处理px以外单位的情况
         */
        scope.renderGotoSignStyle = function (ele) {
          return actionService.renderGotoSignStyle(ele);
        };

        /**
         * 返回线框中线段的CSS样式。
         * 通常来说，应当保持scope.editStat.gotoLineStyle与本函数同步。
         * @func renderGotoLineStyle
         * @param {Element} ele - 对应的元素对象
         * @return {Object} 返回样式表对象
         * @todo 处理px以外单位的情况
         */
        scope.renderGotoLineStyle = function (ele) {
          return actionService.renderGotoLineStyle(ele);
        };

        /**
         * 测试Transition方向是否已禁用
         * @func isTransDirDisabled
         * @param {Action} action - 要测试的Action
         * @return {bool}
         */
        scope.isTransDirDisabled = function (action) {
          return actionService.isTransDirDisabled(action);
        };

        /**
         * transition的方式发生变化时调用此函数
         * @func onTransitionTypeChanged
         * @param {Action} action - 发生变化的的Action
         * @todo 目前没有transition从无到有的默认值，同时也就意味着没有“记忆”能力
         */
        scope.onTransitionTypeChanged = function (action) {
          if (action.transitionType === 'none') {
            action.transitionDirection = 'none';
          } else {
            // TODO: 目前没有默认值，同时也就意味着没有“记忆”能力
          }
        };

        /**
         * 热点被鼠标按下时触发此函数
         * @func onHotspotDown
         * @param {number} index - 被点击的元素的索引值
         * @param {Element} ele - 被点击的元素对象
         * @param {event} $event - 点击事件
         * @private
         */
        scope.onHotspotDown = function (ele, $event) {
          if ($event.which !== 1) {// 不接受非左键点击
            return;
          }
          var sT = this.editStat.hotspotStack;
          this.selectElement(ele);
          sT.hotspotMovingTarget = ele;
          sT.hotspotMovingStart.x = $event.clientX;
          sT.hotspotMovingStart.y = $event.clientY;
          sT.hotspotMovingOffset.x = parseInt($event.target.style.left, 10); // 小心单位
          sT.hotspotMovingOffset.y = parseInt($event.target.style.top, 10);
          sT.hotspotDom = $event.target;
          sT.hotspotOldZindex = sT.hotspotDom.zIndex;
          sT.hotspotDom.zIndex = 10000;
          $document[0].body.style.cursor = 'move';
        };

        /**
         * 热点在鼠标移动时触发此函数
         * @func onHotspotMoved
         * @param {event} $event - 点击事件
         * @private
         */
        scope.onHotspotMoved = function ($event) {
          var sT = this.editStat.hotspotStack;
          // 返回范围内的数值
          if (sT.hotspotMovingTarget !== null) {
            var xT = sT.hotspotMovingOffset.x + $event.clientX - sT.hotspotMovingStart.x;
            var yT = sT.hotspotMovingOffset.y + $event.clientY - sT.hotspotMovingStart.y;
            this.moveHotspotTo(sT.hotspotMovingTarget, xT, yT);
            // TODO: 热点移动时颜色可以发生变化
            // TODO: 热点移动时，如果热点移至屏幕另半侧，则应将线框转移
          }
        };

        /**
         * 热点在鼠标抬起时触发此函数
         * @func onHotspotUp
         * @private
         */
        scope.onHotspotUp = function () {
          var sT = this.editStat.hotspotStack;
          sT.hotspotMovingTarget = null;
          if (!sT.hotspotDom) {
            return;
          }
          sT.hotspotDom.zIndex = sT.hotspotOldZindex;
          // NOTE: 注意这里不要使用auto，以免覆盖CSS中的相应设置
          $document[0].body.style.cursor = '';
        };

        /**
         * 元素缩放触头在鼠标按下时触发此函数
         * @func onExpanderDown
         * @param {number} index - 元素的索引
         * @param {Element} ele - 元素对象
         * @param {number} pos - 触头的索引，用来区分是哪个触头。从左开始顺时针依次为1、2、3、4
         * @param {event} $event - 鼠标事件
         * @private
         */
        scope.onExpanderDown = function (ele, pos, $event) {
          if ($event.which !== 1) {// 不接受非左键点击
            return;
          }
          var sT = this.editStat.expanderStack;
          this.selectElement(ele);
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
          switch (pos) {
          case 1:
            $document[0].body.style.cursor = 'w-resize'; // TODO: 换用更angular的方法
            break;
          case 2:
            $document[0].body.style.cursor = 'n-resize'; // TODO: 换用更angular的方法
            break;
          case 3:
            $document[0].body.style.cursor = 'e-resize'; // TODO: 换用更angular的方法
            break;
          case 4:
            $document[0].body.style.cursor = 's-resize'; // TODO: 换用更angular的方法
            break;
          default:
            break;
          }

        };

        /**
         * 元素缩放触头在鼠标松开时触发此函数
         * @func onExpanderUp
         * @private
         */
        scope.onExpanderUp = function () {
          var sT = this.editStat.expanderStack;
          sT.expanderMovingTarget = null;
          document.body.style.cursor = ''; // TODO: 这里可能应该将光标之前的状态存储，而不是直接使用auto
        };

        /**
         * 元素缩放触头在鼠标移动时触发此函数
         * @func onExpanderMove
         * @param {event} $event - 鼠标事件
         * @private
         */
        scope.onExpanderMove = function ($event) {
          var eT = this.editStat.expanderStack;
          if (eT.expanderMovingTarget !== null) {
            var target = eT.expanderMovingTarget;
            // $event.target.style.cursor = 'move';
            var xT = eT.expanderMovingOffset.x + $event.clientX - eT.expanderMovingStart.x;
            var yT = eT.expanderMovingOffset.y + $event.clientY - eT.expanderMovingStart.y;
            // 计算实际的移动距离
            var deltaY = eT.hotspot.height - yT;
            var deltaX = eT.hotspot.width - xT;

            // TODO: 控制线框的长短
            switch (eT.expanderIndex) {
              // 由于元素的定位实际是左上角的定位，因此左边侧和上边侧的变动，需要同时移动元素来保持整体的静止
            case 1:
              // 防止因无法resize而导致的move
              if (eT.hotspotPos.x - deltaX < eT.hotspotPos.x + eT.hotspot.width) {
                this.moveHotspotTo(target, eT.hotspotPos.x - deltaX, eT.hotspotPos.y);
              }
              // 防止因无法move而导致的resize
              // FIXME: 注意，这两种判断都不是精确的，可能因为鼠标事件精确性发生一定的差错
              if (parseInt(target.posX, 10) > 0 || deltaX < 0) {
                this.resizeHotspotTo(target, eT.hotspot.width + deltaX, eT.hotspot.height);
              }
              break;
            case 2:
              if (eT.hotspotPos.y - deltaY < eT.hotspotPos.y + eT.hotspot.height) {
                this.moveHotspotTo(target, eT.hotspotPos.x, eT.hotspotPos.y - deltaY);
              }
              if (parseInt(target.posY, 10) > 0 || deltaY < 0) {
                this.resizeHotspotTo(target, eT.hotspot.width, eT.hotspot.height + deltaY);
              }
              break;
              // 而右边侧与下边侧的移动则不会对整体位置造成影响
            case 3:
              this.resizeHotspotTo(target, eT.hotspot.width - deltaX, eT.hotspot.height);
              break;
            case 4:
              this.resizeHotspotTo(target, eT.hotspot.width, eT.hotspot.height - deltaY);
              break;
            default:
              break;
            }
          }
        };
      }
    };
  });

})();
