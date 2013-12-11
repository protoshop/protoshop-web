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

  module.directive('editorHotspot', function($document, actionService, elementService, packageService) {
    return {
      restrict: 'AE',
      scope: {
        targetElement: '='
      },
      transclude: true,
      templateUrl: 'partials/hotspot.html',
      link: function(scope, elm) {
        scope.scenes = packageService.package.scenes;
        scope.editStat = packageService.editStat;
        scope.defaults = {
          sceneBackground: 'images/dummy-scene-thumb.png'
        };
        scope.moveHotspotTo = function(ele, x, y) {
          actionService.moveHotspotTo(ele, x, y);
        };
        scope.resizeHotspotTo = function(ele, w, h) {
          actionService.resizeHotspotTo(ele, w, h);
        };
        scope.findSceneById = function(id) {
          return actionService.findSceneById(id);
        };
        scope.renderGotoSignStyle = function() {
          actionService.renderGotoSignStyle();
        };
        scope.renderGotoLineStyle = function() {
          actionService.renderGotoLineStyle();
        };
        scope.renderThumbBackground = function() {
          var defaultOne = scope.defaults.sceneBackground;
          var action = scope.editStat.selectedAction;
          if(!action) {
            return defaultOne;
          }

          var target = scope.findSceneById(action.target).background;
          return (target === '' || !target) ? defaultOne : target;
        }

        var hotspotStack = {
          hotspotMovingTarget: null,
          hotspotDom: null,
          hotspotMovingStart: {
            x: 0,
            y: 0
          },
          hotspotMovingOffset: {
            x: 0,
            y: 0
          },
          hotspotOldZindex: null
        };

        scope.gotoSignStyle = {
          top: '',
          right: ''
        };
        scope.gotoLineStyle = {
          width: '264px'
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
          var sT = hotspotStack;

          sT.hotspotMovingTarget = ele;
          sT.hotspotMovingStart.x = $event.clientX;
          sT.hotspotMovingStart.y = $event.clientY;
          sT.hotspotMovingOffset.x = parseInt($event.target.style.left, 10); // 小心单位
          sT.hotspotMovingOffset.y = parseInt($event.target.style.top, 10);
          sT.hotspotDom = $event.target;
          sT.hotspotOldZindex = sT.hotspotDom.zIndex;
          sT.hotspotDom.zIndex = 10000;
          $document[0].body.style.cursor = 'move';
          elementService.selectElement(ele);
          if (ele.actions.length > 0) {
            actionService.selectAction(ele.actions[0]);
          } else {
            actionService.deselectAction();
          }
        };

        /**
         * 热点在鼠标移动时触发此函数
         * @func onHotspotMoved
         * @param {event} $event - 点击事件
         * @private
         */
        scope.onHotspotMoved = function ($event) {
          var sT = hotspotStack;
          // 返回范围内的数值
          if (sT.hotspotMovingTarget !== null) {
            var xT = sT.hotspotMovingOffset.x + $event.clientX - sT.hotspotMovingStart.x;
            var yT = sT.hotspotMovingOffset.y + $event.clientY - sT.hotspotMovingStart.y;
            scope.moveHotspotTo(sT.hotspotMovingTarget, xT, yT);
            $event.stopPropagation();
            scope.$apply(); // NOTE: 由于onHotspotMoved是事件绑定触发的，需要手动调用$apply以通知angular更新变量
            // TODO: 热点移动时颜色可以发生变化
            // TODO: 热点移动时，如果热点移至屏幕另半侧，则应将线框转移
          }
        };

        /**
         * 热点在鼠标抬起时触发此函数
         * @func onHotspotUp
         * @private
         */
        scope.onHotspotUp = function (event) {
          var sT = hotspotStack;
          sT.hotspotMovingTarget = null;
          if (!sT.hotspotDom) {
            return;
          }
          sT.hotspotDom.zIndex = sT.hotspotOldZindex;
          // NOTE: 注意这里不要使用auto，以免覆盖CSS中的相应设置
          $document[0].body.style.cursor = '';
          $document.unbind('mousemove', scope.onHotspotMoved);
          $document.unbind('mouseup', scope.onHotspotUp);
          event.stopPropagation();
          scope.$apply();
        };

        elm.on('mousedown', function(event) {
          
          scope.onHotspotDown(scope.targetElement, event);
          
          $document.on('mousemove', scope.onHotspotMoved);
          $document.on('mouseup', scope.onHotspotUp);
          event.stopPropagation();

          scope.$apply();
        });

        elm.on('click', function(event) {
          event.stopPropagation();
        });
      }
    };
  });

  module.directive('editorHotspotGroup', function(actionService) {
    return {
      restrict: 'AE',
      transclude: true,
      templateUrl: 'partials/hotspotgroup.html',
      link: function(scope) {
        scope.renderHotspotStyle = function(element) {
          return actionService.renderHotspotStyle(element);
        };
      }
    };
  });

  module.directive('editorHotspotHandle', function($document, actionService) {
    return {
      restrict: 'AE',
      transclude: true,
      templateUrl: 'partials/hotspothandle.html',
      link: function(scope) {
        scope.editStat = actionService.editStat;
        scope.moveHotspotTo = function(ele, x, y) {
          actionService.moveHotspotTo(ele, x, y);
        };
        scope.resizeHotspotTo = function(ele, w, h) {
          actionService.resizeHotspotTo(ele, w, h);
        };

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
          var sT = expanderStack;
          sT.expanderMovingTarget = null;
          $document[0].body.style.cursor = ''; // TODO: 这里可能应该将光标之前的状态存储，而不是直接使用auto
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

})();
