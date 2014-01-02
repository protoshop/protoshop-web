'use strict';
(function () {
  var module = angular.module('toHELL');

  module.directive('pxUnit', function () {
    return {
      require: 'ngModel',
      link   : function (scope, elm, attrs, ctrl) {
        ctrl.$parsers.unshift(function (viewValue) {
          ctrl.$setValidity('integer', true);
          // NOTE: value considered to be integer only.
          return parseInt(viewValue, 10);
        });
      }
    };
  });

  module.directive('timeUnit', function () {
    return {
      require: 'ngModel',
      link   : function (scope, elm, attrs, ctrl) {
        ctrl.$parsers.unshift(function (viewValue) {
          // NOTE: value considered to be float only.
          return parseFloat(viewValue);
        });
      }
    };
  });

  module.directive('editorHotspot', ['$document', function ($document) {
      var lastCursor = '';
      return {
        restrict   : 'AE',
        transclude : true,
        templateUrl: 'partials/hotspot.html',
        link       : function (scope, elm) {
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

          var hotspotStack = {
            hotspotMovingTarget: null,
            hotspotDom         : null,
            hotspotMovingStart : {
              x: 0,
              y: 0
            },
            hotspotMovingOffset: {
              x: 0,
              y: 0
            },
            hotspotOldZindex   : null
          };

          scope.gotoSignStyle = {
            top  : '',
            right: ''
          };
          scope.gotoLineStyle = {
            width: '264px'
          };

          /**
           * 热点被鼠标按下时触发此函数
           * @func onHotspotDown
           * @param {Element} ele - 被点击的元素对象
           * @param {event} $event - 点击事件
           * @private
           */
          scope.onHotspotDown = function (ele, $event) {
            if ($event.which !== 1) {// 不接受非左键点击
              return;
            }
            var sT = hotspotStack;
            var jBody = $document.find('body');

            sT.hotspotMovingTarget = ele;
            sT.hotspotMovingStart.x = $event.clientX;
            sT.hotspotMovingStart.y = $event.clientY;
            sT.hotspotMovingOffset.x = parseInt($event.target.style.left, 10); // 小心单位
            sT.hotspotMovingOffset.y = parseInt($event.target.style.top, 10);
            sT.hotspotDom = $event.target;
            sT.hotspotOldZindex = sT.hotspotDom.zIndex;
            sT.hotspotDom.zIndex = 10000;
            lastCursor = jBody.css('cursor');
            jBody.css('cursor', 'move');
            scope.selectElement(ele);
            // if (ele.actions.length > 0) {
            //   scope.selectAction(ele.actions[0]);
            // } else {
            //   scope.deselectAction();
            // }
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
            $document.find('body').css('cursor', lastCursor);
            $document.unbind('mousemove', scope.onHotspotMoved);
            $document.unbind('mouseup', scope.onHotspotUp);
            event.stopPropagation();
          };

          elm.on('mousedown', function (event) {

            scope.onHotspotDown(scope.targetElement, event);

            $document.on('mousemove', function (ev) {
              scope.onHotspotMoved(ev);
              // NOTE: 由于onHotspotMoved是事件绑定触发的，需要手动调用$apply以通知angular更新变量
              scope.$apply();
            });
            $document.on('mouseup', function (ev) {
              scope.onHotspotUp(ev);
              scope.$apply();
            });
            event.stopPropagation();

            scope.$apply();
          });

          elm.on('click', function (event) {
            event.stopPropagation();
          });
        }
      };
    }]);

  module.directive('editorHotspotGroup', [function () {
    return {
      restrict   : 'AE',
      transclude : true,
      templateUrl: 'partials/hotspotgroup.html'
    };
  }]);

  module.directive('editorHotspotHandle', ['$document', function ($document) {
      var lastCursor = '';
      return {
        restrict   : 'AE',
        transclude : true,
        templateUrl: 'partials/hotspothandle.html',
        link       : function (scope) {
          var expanderStack = {
            expanderMovingTarget: null,
            expanderMovingStart : {
              x: 0,
              y: 0
            },
            expanderMovingOffset: {
              x: 0,
              y: 0
            },
            hotspotPos          : {
              x: 0,
              y: 0
            },
            hotspot             : {
              width : 0,
              height: 0
            },
            expanderIndex       : null
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
    }
  ]);
  
  module.directive('sceneListItem', [function () {
    return {
      restrict: 'A',
      link: function (scope, element) {
        // 只有真正属于增加场景的时候才需要聚焦。由于包的内容是异步加载的，
        // 如果缺少这样的判断，directive并不知道自己是包中已有的场景渲染出来的，
        // 还是由于后期手动添加的
        if (scope.editStat.sceneHasAdded) {
          var item = element.find('input:eq(0)');
          // FIXME: 很奇怪这里如果不延时则不能选中文字，只能聚焦
          // 可能是因为在函数执行后其他DOM元素的操作影响了文字的选中
          item.focus().select();
          scope.$evalAsync(function () {
            item.focus().select();
          }, 0);
        }

        // 增加拖拽排序 
        var dom = element[0];

        dom.draggable = true;

        dom.addEventListener('dragstart', function (e) {
          scope.deselectScene();
          e.dataTransfer.effectAllowed = 'move';
          e.dataTransfer.setData('scene', scope.scene.order);
          dom.classList.add('item-drag');
          return false;
        }, false);

        dom.addEventListener('dragend', function (e) {
          dom.classList.remove('item-drag');
          scope.selectScene(scope.scene);
          scope.$apply(); // NOTE: 迫使angular刷新DOM
          return false;
        }, false);

        dom.addEventListener('dragover', function (e) {
          // 迫使浏览器一定会产生drop事件
          // TODO: 如果在这里重排序，则有可能可以实时预览移动效果
          e.preventDefault();
          return false;
        }, false);

        dom.addEventListener('dragenter', function (e) {
          dom.classList.add('item-drag');
          scope.$apply();
          return false;
        }, false);

        dom.addEventListener('dragleave', function (e) {
          dom.classList.remove('item-drag');
          scope.$apply();
          return false;
        }, false);

        dom.addEventListener('drop', function (e) {
          // 禁用某些浏览器的默认行为
          if (e.stopPropagation) e.stopPropagation();

          var fromScene = e.dataTransfer.getData('scene');
          scope.orderScene(fromScene, scope.scene.order);
          dom.classList.remove('item-drag');
          
          scope.$apply(); // NOTE: 迫使angular刷新DOM
          return false;
        }, false);
      }
    };
  }]);

  /**
   * Directive "ng-file" for uploading
   *
   * Attributes:
   * @Attr ng-file {String} the attr to bind on $scope.
   * @Attr ng-file-change {String} the method on $scope to call on change.
   */
  module.directive('ngFile', function () {
    return {
      link: function (scope, el, attrs) {
        var args = {
          bindAttr: attrs['ngFile'] || 'file',
          onChange: attrs['ngFileChange']
        };
        el.bind('change', function (ev) {
          scope[args.bindAttr] = ev.target.files;
          scope.$apply();

          if (args.onChange) {
            scope[args.onChange](ev.target.files);
          }
        });
      }
    }
  });

  module.directive('notify', ['$document', 'notifyService', function ($document, notifyService) {
    function positionCenter(ele) {
      ele.css({
        position: 'absolute',
        top: '10px',
        left: ($document.width() - ele.width()) / 2
      });
    }
    return {
      restrict: 'AE',
      templateUrl: 'partials/notify.html',
      scope: {
        //
      },
      link: function (scope, element) {
        positionCenter(element);
        scope.items = notifyService.items;
      }
    };
  }]);

  module.directive('notifyItem', ['notifyService', function (notifyService) {
    return {
      restrict: 'AE',
      scope: {
        target: '=itemTarget'
      },
      link: function (scope, element) {
        function dismiss() {
          notifyService.remove(scope.target);
        }

        element.on('click', function () {
          dismiss();
          scope.$apply();
        });
      }
    };
  }]);

})();