'use strict';

(function () {
  var module = angular.module('toHELL');

  module.factory('editService', [function () {
    var packageLoaded = false;
    var deviceDescription = {
      android: {
        width: 400,
        height: 640
      },
      ios: {
        width: 320,
        height: 568
      }
    };
    function EditServiceInstance() {
      var self = this;

      this.package = {
        scenes: []
      };
      this.editStat = {
        selectedScene: null,
        selectedElement: null,
        selectedAction: null,
        sceneHasAdded: false
      };

      this.setPackage = function (pkg) {
        this.package = pkg;
        packageLoaded = true;
      };
      this.setStat = function (es) {
        this.editStat = es;
      };

      /**
       * 搜索最大的场景order
       * @func findSceneByOrder
       * @return {number} 返回找到的最大order，如果不存在任何一个场景则返回-1。
       */
      function findMaxSceneOrder() {
        return self.package.scenes.length - 1;
      }

      this.defaults = {
        sceneBackground: 'images/dummy-scene-thumb.png'
      };

      /**
       * 选中一个场景
       * @func selectScene
       * @param {Object} scene - 被选中的场景
       */
      this.selectScene = function (scene) {
        self.editStat.selectedScene = scene;
        // 清除掉之前可能有的其他元素、动作选择
        self.deselectElement();
        self.deselectAction();
      };

      /**
       * 释放选中的场景。连带释放选中的元素。
       * @func deselectScene
       */
      this.deselectScene = function () {
        self.editStat.selectedScene = null;
        self.deselectElement();
        self.deselectAction();
      };

      /**
       * 增加一个场景。增加的场景将在所有场景之后。
       * @func addScene
       * @return {Object} 返回新增的场景对象
       */
      this.addScene = function () {
        var newScene = {
          id        : Date.now(),
          order     : findMaxSceneOrder() + 1,
          name      : 'New Scene',
          background: '',
          elements  : []
        };
        self.package.scenes.push(newScene);

        self.editStat.sceneHasAdded = true;
        self.deselectElement();
        self.deselectAction();
        self.selectScene(newScene);
        smoothSceneOrder(self.package.scenes);
        return newScene;
      };

      /**
       * 新增插入一个场景。
       * @func insertScene
       * @param {Object} scene - 新增的场景将在该scene之后
       * @return {Object} 返回新增的场景对象
       */
      this.insertScene = function (scene) {
        if (!scene) {
          return this.addScene();
        }
        var newScene = {
          id        : Date.now(),
          order     : parseInt(scene.order, 10) + 1,
          name      : 'New Scene',
          background: '',
          elements  : []
        };
        self.package.scenes.push(newScene);

        function adjustOrderAfter(newScene) {
          var scenes = self.package.scenes;
          var n = parseInt(newScene.order, 10);
          for (var s in scenes) {
            var rOrder = parseInt(scenes[s].order, 10);
            scenes[s].order = rOrder;
            if (rOrder >= n && newScene !== scenes[s]) {
              scenes[s].order = rOrder + 1;
            }
          }
        }

        adjustOrderAfter(newScene);

        self.editStat.sceneHasAdded = true;
        self.deselectElement();
        self.deselectAction();
        self.selectScene(newScene);
        smoothSceneOrder(self.package.scenes);
        return newScene;
      };

      /**
       * 使位于from的场景现在调整至to。在移动过程中，from和to之间的场景之间的关系不变，会被一同挪动。
       * 若from小于to，则表现为后移；
       * 若from大于to，则表现为前移；
       * 若from和to相等，不发生任何移动。
       * @func orderScene
       * @param {Object} from - 原始位置
       * @param {Object} to - 目标位置
       */
      this.orderScene = function (from, to) {
        var scenes = self.package.scenes;
        if (from > to) {
          for(var s=0;s<scenes.length;++s) {
            if( scenes[s].order < from && scenes[s].order >= to) {
              scenes[s].order += 1;
            } else if (scenes[s].order - from === 0) {
              scenes[s].order = to;
            }
          }
        } else if (from < to) {
          for(var s=0;s<scenes.length;++s) {
            if( scenes[s].order > from && scenes[s].order <= to) {
              scenes[s].order -= 1;
            }else if(scenes[s].order - from === 0) {
              scenes[s].order = to;
            }
          }
        }
      };

      /**
       * 删除一个场景。如果不存在满足条件的场景，则操作无效。
       * @func removeScene
       * @param {Object} scene - 所要删除的场景对象
       */
      this.removeScene = function (scene) {
        var scenes = self.package.scenes;
        var index = scenes.indexOf(scene);
        if (index < 0) {
          return;
        }
        // 当删除的是选中场景时，释放对场景的选择
        if (scene === self.editStat.selectedScene) {
          self.deselectScene();
          self.deselectElement();
          self.deselectAction();
        }
        scenes.splice(index, 1);
        smoothSceneOrder(self.package.scenes);
      };

      /**
       * 搜索符合条件的场景
       * @private
       * @func findScene
       * @param {string} key - 要搜索的键
       * @param {string|number} value - 要搜索的值
       * @return {number|null} 如果找到则返回该场景的id，否则返回null
       */
      this.findScene = function (key, value) {
        var scenes = self.package.scenes;
        for (var i = scenes.length - 1; i >= 0; i--) {
          if (scenes[i][key] === value) {
            return scenes[i];
          }
        }
        return null;
      };

      // 快捷方法
      /**
       * 搜索特定id的场景
       * @func findSceneById
       * @param {number} id - 要搜索的id
       * @return {Object|null} 如果找到则返回该场景对象，否则返回null
       */
      this.findSceneById = function (id) {
        return this.findScene('id', id);
      };

      /**
       * 平滑场景order。函数保证将一个合法的scene数组，处理为order从0起始且严格递增的scene数组
       * @func smoothSceneOrder
       * @param {Array} scenes - scene组成的数组
       */
      function smoothSceneOrder(scenes) {
        scenes.sort(function (a, b) {
          return parseInt(a.order, 10) - parseInt(b.order, 10);
        });
        for(var i=0;i<scenes.length;++i) {
          scenes[i].order = i;
        }
      }

      /**
       * 选中一个元素
       * @func selectElement
       * @param {number} elementIndex 该元素的索引值
       * @todo 目前考虑自动选中第一个action，时机成熟时移除
       */
      this.selectElement = function (element) {
        self.deselectAction();
        self.deselectElement();
        self.editStat.selectedElement = element;
        
        if (element.actions.length > 0) {
          self.selectAction(element.actions[0]);
        }
      };

      /**
       * 释放选中的元素。释放时会连带释放动作的选中。
       * @func deselectElement
       */
      this.deselectElement = function () {
        self.deselectAction();
        self.editStat.selectedElement = null;
      };

      /**
       * 删除一个动作。如果该动作被选中，首先会被取消选中。
       * @func addAction
       * @param {Action} action - 要移除的动作对象
       */
      this.removeElement = function (element) {
        var elements = self.editStat.selectedScene.elements;
        var index = elements.indexOf(element);
        if (index < 0) {
          return;
        }
        // 当删除的是选中场景时，释放对场景的选择
        if (element === self.editStat.selectedElement) {
          this.deselectElement();
        }
        elements.splice(index, 1);
      };

      /**
       * 增加一个hotspot元素
       * @func addHotspotElement
       */
      this.addHotspotElement = function () {
        var scene = self.editStat.selectedScene;
        var newElement = {
          // 默认参数
          type   : 'hotspot',
          posX   : 100,
          posY   : 300,
          width  : 120,
          height : 42,
          actions: []
        };
        scene.elements.push(newElement);
        this.selectElement(newElement);
        self.deselectAction();
      };

      /**
       * 选中一个动作
       * @func selectAction
       * @param {Object} action 所要选中的动作对象
       */
      this.selectAction = function (action) {
        var aT = self.editStat;
        var bT = aT.selectedElement;
        if (action === null || bT === null) {
          aT.selectedAction = null;
          return;
        }

        if (bT.actions.indexOf(action) > -1) {
          aT.selectedAction = action;
          self.editStat.gotoSignStyle = this.renderGotoSignStyle(bT);
          self.editStat.gotoLineStyle = this.renderGotoLineStyle(bT);
        } else {
          aT.selectedAction = null;
        }
      };

      /**
       * 释放选中的动作。
       * @func deselectAction
       */
      this.deselectAction = function () {
        self.editStat.selectedAction = null;
      };

      /**
       * 增加一个动作。该动作会直接增加在当前元素中。
       * @func addAction
       */
      this.addAction = function () {
        var actions = self.editStat.selectedElement.actions;
        if (actions.length > 0) {
          // 当前一个Element只能有一个Action
          return;
        }
        var newAction = {
          type               : 'jumpto',
          target             : null,
          transitionType     : 'push',
          transitionDirection: 'up',
          transitionDelay    : 0,
          transitionDuration : 3.25
        };
        actions.push(newAction);
        this.selectAction(newAction);
      };

      /**
       * 删除一个动作。如果该动作被选中，首先会被取消选中。
       * @func addAction
       * @param {Action} action - 要移除的动作对象
       */
      this.removeAction = function (action) {
        var actions = self.editStat.selectedElement.actions;
        var index = actions.indexOf(action);
        if (index < 0) {
          return;
        }
        // 当删除的是选中场景时，释放对场景的选择
        if (action === self.editStat.selectedAction) {
          this.deselectAction();
        }
        actions.splice(index, 1);
      };

      /**
       * 将一条Action渲染为文本信息
       * @func renderActionItem
       * @param {Object} action - 要渲染的action
       * @return {string} 文本信息
       */
      this.renderActionItem = function (action) {
        var actionText = '';
        switch (action.type) {
        case 'jumpto':
          actionText += 'Go To: ';
          break;
        default:
          actionText += 'Unknown Action: ';
        }

        var scene = this.findSceneById(action.target);

        if (scene) {
          actionText += scene.name;
        } else {
          actionText += '';
        }

        return actionText;
      };

      /**
       * 返回一个元素的坐标样式信息
       * @func renderHotspotStyle
       * @param {Object} element - 要处理的元素
       * @return {Object} 样式信息，需包含left、top、width、height
       */
      this.renderHotspotStyle = function (element) {
        return {
          left  : element.posX,
          top   : element.posY,
          width : element.width,
          height: element.height
        };
      };

      /**
       * 返回线框整体的CSS样式。线框整体指的是包裹线框指示器、线段、属性栏等物件的容器。
       * 通常来说，应当保持$scope.editStat.gotoSignStyle与本函数同步。
       * @func renderGotoSignStyle
       * @param {Object} ele - 对应的元素对象
       * @return {Object} 返回样式表对象
       * @todo 处理px以外单位的情况
       */
      this.renderGotoSignStyle = function (ele) {
        // var x = parseInt(ele.posX, 10);
        // var y = parseInt(ele.posY, 10);
        var width = parseInt(ele.width, 10);
        // var height = parseInt(ele.height, 10);
        var o = calcGotoSignStyle(width);
        return {
          right: o.x + 'px'
        };
      };

      /**
       * 返回线框中线段的CSS样式。
       * 通常来说，应当保持$scope.editStat.gotoLineStyle与本函数同步。
       * @func renderGotoLineStyle
       * @param {Object} ele - 对应的元素对象
       * @return {Object} 返回样式表对象
       * @todo 处理px以外单位的情况
       */
      this.renderGotoLineStyle = function (ele) {
        var o = calcGotoLineStyle(parseInt(ele.posX, 10));
        return {
          width: o.width + 'px'
        };
      };

      /**
       * 将热点平移至指定位置。函数保证热点不会超出屏幕。
       * @func moveHotspotTo
       * @param {Object} ele - 关联的热点对象
       * @param {number|String} x - 横坐标。可携带单位，比如10px
       * @param {number|String} y - 纵坐标。同样可携带单位
       * @todo 屏幕应当可配置
       */
      this.moveHotspotTo = function (ele, x, y) {
        // TODO: 屏幕的尺寸应当可配置
        var widthMax = deviceDescription.android.width - parseInt(ele.width, 10);
        var heightMax = deviceDescription.android.height - parseInt(ele.height, 10);
        var xValue = parseInt(x, 10);
        var yValue = parseInt(y, 10);
        ele.posX = bound(0, xValue, widthMax);
        ele.posY = bound(0, yValue, heightMax);
        self.editStat.gotoSignStyle = this.renderGotoSignStyle(ele);
        self.editStat.gotoLineStyle = this.renderGotoLineStyle(ele);
      };

      /**
       * 将热点缩放至特定尺寸。函数保证热点不会超出屏幕。
       * @func resizeHotspotTo
       * @param {Object} ele - 关联的热点对象
       * @param {number|String} w - 宽度。可携带单位，比如10px
       * @param {number|String} h - 高度。同样可携带单位
       * @todo 屏幕应当可配置
       */
      this.resizeHotspotTo = function (ele, w, h) {
        // TODO: 屏幕的尺寸应当可配置
        var widthMax = deviceDescription.android.width - parseInt(ele.posX, 10);
        var heightMax = deviceDescription.android.height - parseInt(ele.posY, 10);
        ele.width = bound(0, parseInt(w, 10), widthMax);
        ele.height = bound(0, parseInt(h, 10), heightMax);
        self.editStat.gotoSignStyle = this.renderGotoSignStyle(ele);
        self.editStat.gotoLineStyle = this.renderGotoLineStyle(ele);
      };

      /**
       * 辅助函数，将值限定在某个区间之内
       * @func bound
       * @param {number} min - 最小值
       * @param {number} value - 需要进行限定的值
       * @param {number} max - 最大值
       * @return {number} 若value在区间内，则返回value；否则最小为min，最大为max，
       * @private
       */
      function bound(min, value, max) {
        if (value < min) {
          return min;
        }
        if (value > max) {
          return max;
        }
        return value;
      }

      /**
       * 计算线框整体的坐标值。目前返回hotspot的左上角
       * @func calcGotoSignStyle
       * @param {number} width - 元素的宽度
       * @return {object} 返回计算出的x值，不含单位。
       * @private
       */
      function calcGotoSignStyle(width) {
        return {
          x: width
        };
      }

      /**
       * 计算线框线段的宽度。
       * @func calcGotoLineStyle
       * @param {number} gotoSignX - 相应线框整体的x坐标
       * @private
       * @todo 减少硬编码，去除对单位（px）的依赖
       */
      function calcGotoLineStyle(gotoSignX) {
        return {
          width: (200 + gotoSignX) // 200表示goto thumb图距离设备的最小距离，目前单位实际为px
        };
      }
    }

    return new EditServiceInstance();
  }]);
})();
