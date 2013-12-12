'use strict';

(function () {
  var module = angular.module('toHELL');

  module.factory('actionService', ['packageService', function (packageService) {
    function ActionServiceInstance() {

      /**
       * 选中一个动作
       * @func selectAction
       * @param {Object} action 所要选中的动作对象
       */
      this.selectAction = function (action) {
        var aT = packageService.editStat;
        var bT = aT.selectedElement;
        if (action === null || bT === null) {
          aT.selectedAction = null;
          return;
        }

        if (bT.actions.indexOf(action) > -1) {
          aT.selectedAction = action;
          packageService.editStat.gotoSignStyle = this.renderGotoSignStyle(bT);
          packageService.editStat.gotoLineStyle = this.renderGotoLineStyle(bT);
        } else {
          aT.selectedAction = null;
        }
      };

      /**
       * 释放选中的动作。
       * @func deselectAction
       */
      this.deselectAction = function () {
        packageService.editStat.selectedAction = null;
      };

      /**
       * 增加一个动作。该动作会直接增加在当前元素中。
       * @func addAction
       */
      this.addAction = function () {
        var actions = packageService.editStat.selectedElement.actions;
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
        var actions = packageService.editStat.selectedElement.actions;
        var index = actions.indexOf(action);
        if (index < 0) {
          return;
        }
        // 当删除的是选中场景时，释放对场景的选择
        if (action === packageService.editStat.selectedAction) {
          this.deselectAction();
        }
        actions.splice(index, 1);
      };

      /**
       * 搜索符合条件的场景
       * @private
       * @func findScene
       * @param {string} key - 要搜索的键
       * @param {string|number} value - 要搜索的值
       * @return {number|null} 如果找到则返回该场景的id，否则返回null
       * @todo 与sceneService的相关代码合并
       */
      this.findScene = function (key, value) {
        var scenes = packageService.package.scenes;
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
          actionText += '???';
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
        var widthMax = 320 - parseInt(ele.width, 10);
        var heightMax = 568 - parseInt(ele.height, 10);
        var xValue = parseInt(x, 10);
        var yValue = parseInt(y, 10);
        ele.posX = bound(0, xValue, widthMax);
        ele.posY = bound(0, yValue, heightMax);
        packageService.editStat.gotoSignStyle = this.renderGotoSignStyle(ele);
        packageService.editStat.gotoLineStyle = this.renderGotoLineStyle(ele);
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
        var widthMax = 320 - parseInt(ele.posX, 10);
        var heightMax = 568 - parseInt(ele.posY, 10);
        ele.width = bound(0, parseInt(w, 10), widthMax);
        ele.height = bound(0, parseInt(h, 10), heightMax);
        packageService.editStat.gotoSignStyle = this.renderGotoSignStyle(ele);
        packageService.editStat.gotoLineStyle = this.renderGotoLineStyle(ele);
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

    return new ActionServiceInstance();
  }]);
})();
