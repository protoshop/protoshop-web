'use strict';

(function () {
  var module = angular.module('toHELL');

  module.factory('elementService', ['packageService', function(packageService) {
      function ElementServiceInstance() {  
        /**
         * 选中一个元素
         * @func selectElement
         * @param {number} elementIndex 该元素的索引值
         * @todo 目前考虑自动选中第一个action，时机成熟时移除
         */
        this.selectElement = function (element) {
          packageService.editStat.selectedElement = element;
        };
  
        /**
         * 释放选中的元素。释放时会连带释放动作的选中。
         * @func deselectElement
         */
        this.deselectElement = function () {
          packageService.editStat.selectedElement = null;
        };

        /**
         * 删除一个动作。如果该动作被选中，首先会被取消选中。
         * @func addAction
         * @param {Action} action - 要移除的动作对象
         */
        this.removeElement = function(element) {
          var elements = packageService.package.selectedScene.elements;
          var index = elements.indexOf(element);
          if (index < 0) {
            return;
          }
          // 当删除的是选中场景时，释放对场景的选择
          if (element === packageService.editStat.selectedElement) {
            this.deselectElement();
          }
          actions.splice(index, 1);
        };
  
        /**
         * 增加一个hotspot元素
         * @func addHotspotElement
         */
        this.addHotspotElement = function () {
          var scene = packageService.editStat.selectedScene;
          var newElement = {
            // 默认参数
            type: 'hotspot',
            posX: 100,
            posY: 300,
            width: 120,
            height: 42,
            actions: []
          };
          scene.elements.push(newElement);
          this.selectElement(newElement);
        };
  
      }
      return new ElementServiceInstance();
    }]);
})();
