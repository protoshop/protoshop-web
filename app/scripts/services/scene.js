'use strict';

(function () {
  var module = angular.module('toHELL');

  module.factory('sceneService', function() {
    function SceneServiceInstance() {
      var self = this;
      this.editStat = {};
      this.package = {};

      this.setStat = function(editStat) {
        this.editStat = editStat;
      };

      this.setPackage = function(pkg) {
        this.package = pkg;
      };

      this.defaults = {
        sceneBackground: 'images/dummy-scene-thumb.png'
      };

      /**
       * 选中一个场景
       * @func selectScene
       * @param {Scene} scene - 被选中的场景
       */
      this.selectScene = function (scene) {
        this.editStat.selectedScene = scene;
      };
      
      /**
       * 释放选中的场景。连带释放选中的元素。
       * @func deselectScene
       */
      this.deselectScene = function () {
        this.editStat.selectedScene = null;
      };

      /**
       * 增加一个场景。增加的场景将在所有场景之后。
       * @func addScene
       * @return {Scene} 返回新增的场景对象
       */
      this.addScene = function () {
        var newScene = {
          id: Date.now(),
          order: findMaxSceneOrder() + 1,
          name: 'New Scene',
          background: '',
          elements: []
        };
        this.package.scenes.push(newScene);
        return newScene;
      };

      /**
       * 增加一个场景并插入在所给order之后。
       * @func insertScene
       * @param {number} lastOrder - 新场景所要跟随的order
       * @return {Scene} 返回新增的场景对象
       * @todo
       */
      // $scope.insertScene = function (lastOrder) {
      //   // TODO
      // };

      /**
       * 删除一个场景。如果不存在满足条件的场景，则操作无效。
       * @func removeScene
       * @param {Scene} scene - 所要删除的场景对象
       */
      this.removeScene = function (scene) {
        var scenes = this.package.scenes;
        var index = scenes.indexOf(scene);
        if (index < 0) {
          return;
        }
        // 当删除的是选中场景时，释放对场景的选择
        if (scene === this.editStat.selectedScene) {
          this.deselectScene();
        }
        scenes.splice(index, 1);
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
        var scenes = this.package.scenes;
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
       * @return {Scene|null} 如果找到则返回该场景对象，否则返回null
       */
      this.findSceneById = function (id) {
        return this.findScene('id', id);
      };

      /**
       * 搜索特定order的场景
       * @func findSceneByOrder
       * @param {number} order - 要搜索的order
       * @return {Scene|null} 如果找到则返回该场景对象，否则返回null
       */
      this.findSceneByOrder = function (order) {
        return this.findScene('order', order);
      };

      /**
       * 搜索最大的场景order
       * @func findSceneByOrder
       * @return {number} 返回找到的最大order，如果不存在任何一个场景则返回-1。
       */
      function findMaxSceneOrder() {
        return self.package.scenes.length - 1;

        // NOTE: 当order可能超出length-1时，使用以下实现
        // var maxOrder = -1;
        // var sT = $scope.package.scenes;
        // for (var i = sT.length - 1; i >= 0; i--) {
        //   maxOrder = sT[i].order > maxOrder ? sT[i].order : maxOrder;
        // };
        // return maxOrder;
      }

    }
    return new SceneServiceInstance();
  });
})();


