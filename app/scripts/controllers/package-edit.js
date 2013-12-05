'use strict';

angular.module('toHELL')
  .controller('PackageEditCTRL', ['$scope', '$routeParams', '$http', '$document',
    'GLOBAL', 'sceneService', 'elementService', 'actionService',
    function ($scope, $routeParams, $http, $document, GLOBAL, sceneService, elementService, actionService) {
      /**
       * 存储当前的编辑状态
       * @var {Object}
       */
      $scope.editStat = {
        selectedScene: null,
        selectedElement: null,
        selectedAction: null,
        gotoSignStyle: {
          top: '',
          right: ''
        },
        gotoLineStyle: {
          width: '264px'
        },
        /**
         * 移动hotspot时的临时存储栈
         * @var hotspotStack
         * @private
         */
        hotspotStack: {
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
        },
        expanderStack: {
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
        }
      };

      $scope.package = {};
      /**
       * 存储整个工程的实时状态
       * @var {Object} $scope.package
       */
     $http.get('/api/package/' + $routeParams.pkgId + '.json')
      // $http.post(GLOBAL.apiHost + 'fetchProject/', {
        // appid: $routeParams.pkgId
      // })
        .success(function (data) {
          $scope.package = data;
          sceneService.setPackage($scope.package);
          elementService.setPackage($scope.package);
          actionService.setPackage($scope.package);
        })
        .error(GLOBAL.errLogger);

      sceneService.setStat($scope.editStat);
      elementService.setStat($scope.editStat);
      actionService.setStat($scope.editStat);

      /**
       * 选中一个场景
       * @func selectScene
       * @param {Scene} scene - 被选中的场景
       */
      $scope.selectScene = function (scene) {
        sceneService.selectScene(scene);
        // 清除掉之前可能有的其他元素、动作选择
        this.selectElement(null);
      };

      $scope.defaults = {
        sceneBackground: 'images/dummy-scene-thumb.png'
      };

      /**
       * 释放选中的场景。连带释放选中的元素。
       * @func deselectScene
       */
      $scope.deselectScene = function () {
        sceneService.deselectScene();
        this.deselectElement();
      };

      /**
       * 增加一个场景。增加的场景将在所有场景之后。
       * @func addScene
       * @return {Scene} 返回新增的场景对象
       */
      $scope.addScene = function () {
        return sceneService.addScene();
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
      $scope.removeScene = function (scene) {
        return sceneService.removeScene(scene);
      };

      /**
       * 选中一个元素
       * @func selectElement
       * @param {number} elementIndex 该元素的索引值
       * @todo 目前考虑自动选中第一个action，时机成熟时移除
       */
      $scope.selectElement = function (element) {
        elementService.selectElement(element);
        // FIXME: 目前考虑自动选中第一个action，时机成熟时移除
        // TODO: 选择第一个Action。
        if (this.editStat.selectedElement && element.actions.length > 0) {
          this.selectAction(element.actions[0]);
        }
      };

      /**
       * 释放选中的元素。释放时会连带释放动作的选中。
       * @func deselectElement
       */
      $scope.deselectElement = function () {
        elementService.deselectElement();
        // 连带释放Action的选中
        this.deselectAction();
      };

      /**
       * 增加一个hotspot元素
       * @func addHotspotElement
       */
      $scope.addHotspotElement = function () {
        elementService.addHotspotElement();
      };

      /**
       * 选中一个动作
       * @func selectAction
       * @param {Action} action 所要选中的动作对象
       */
      $scope.selectAction = function (action) {
        actionService.selectAction(action);
      };

      /**
       * 释放选中的动作。
       * @func deselectAction
       */
      $scope.deselectAction = function () {
        actionService.deselectAction();
      };

      /**
       * 增加一个动作。该动作会直接增加在当前元素中。
       * @func addAction
       */
      $scope.addAction = function () {
        actionService.addAction();
      };

      /**
       * 编辑区空白区域点击时调用此函数，用以清除已选元素、动作
       * @func onBackgroundClick
       * @private
       */
      $scope.onBackgroundClick = function () {
        this.selectElement(null);
      };

      /**
       * 搜索符合条件的场景
       * @private
       * @func findScene
       * @param {string} key - 要搜索的键
       * @param {string|number} value - 要搜索的值
       * @return {number|null} 如果找到则返回该场景的id，否则返回null
       */
      $scope.findScene = function (key, value) {
        return sceneService.findScene(key, value);
      };

      // 快捷方法
      /**
       * 搜索特定id的场景
       * @func findSceneById
       * @param {number} id - 要搜索的id
       * @return {Scene|null} 如果找到则返回该场景对象，否则返回null
       */
      $scope.findSceneById = function (id) {
        return this.findScene('id', id);
      };

      /**
       * 搜索特定order的场景
       * @func findSceneByOrder
       * @param {number} order - 要搜索的order
       * @return {Scene|null} 如果找到则返回该场景对象，否则返回null
       */
      $scope.findSceneByOrder = function (order) {
        return this.findScene('order', order);
      };

      /**
       * 搜索最大的场景id
       * @func findMaxSceneId
       * @return {number} 返回该id。如果不存在任何一个场景，返回-1。
       */
      function findMaxSceneId() {
        return sceneService.findMaxSceneId();
      }

      /**
       * 搜索最大的场景order
       * @func findSceneByOrder
       * @return {number} 返回找到的最大order，如果不存在任何一个场景则返回-1。
       */
      function findMaxSceneOrder() {
        return sceneService.findMaxSceneOrder();
      }

      /**
       * 将一条Action渲染为文本信息
       * @func renderActionItem
       * @param {Action} action - 要渲染的action
       * @return {string} 文本信息
       */
      $scope.renderActionItem = function (action) {
        return actionService.renderActionItem(action);
      };

      /**
       * 将热点平移至指定位置。函数保证热点不会超出屏幕。
       * @func moveHotspotTo
       * @param {Element} ele - 关联的热点对象
       * @param {number|String} x - 横坐标。可携带单位，比如10px
       * @param {number|String} y - 纵坐标。同样可携带单位
       * @todo 屏幕应当可配置
       */
      $scope.moveHotspotTo = function (ele, x, y) {
        return actionService.moveHotspotTo(ele, x, y);
      };

      /**
       * 将热点缩放至特定尺寸。函数保证热点不会超出屏幕。
       * @func resizeHotspotTo
       * @param {Element} ele - 关联的热点对象
       * @param {number|String} w - 宽度。可携带单位，比如10px
       * @param {number|String} h - 高度。同样可携带单位
       * @todo 屏幕应当可配置
       */
      $scope.resizeHotspotTo = function (ele, w, h) {
        return actionService.resizeHotspotTo(ele, w, h);
      };

      /**
       * 场景中鼠标移动时触发此函数。由于热点区域有多个可点击、拖动的对象，这个函数用来将其分发。
       * @func onSceneMoved
       * @param {event} $event - 点击事件
       * @private
       */
      $scope.onSceneMoved = function ($event) {
        var eT = this.editStat;
        var sT = eT.hotspotStack;
        var expT = eT.expanderStack;

        if (sT.hotspotMovingTarget !== null) {
          this.onHotspotMoved($event);
        }
        if (expT.expanderMovingTarget !== null) {
          this.onExpanderMove($event);
        }
      };

      /**
       * 场景中鼠标抬起时触发此函数。由于热点区域有多个可点击、拖动的对象，这个函数用来将其分发。
       * @func onSceneUp
       * @param {event} $event - 点击事件
       * @private
       */
      $scope.onSceneUp = function ($event) {
        this.onHotspotUp($event);
        this.onExpanderUp($event);
      };



      /**
       * 保存编辑好的项目JSON数据
       */
      $scope.savePackage = function () {
        $http.post(GLOBAL.apiHost + 'saveProject/', {
          context: $scope.package
        })
          .success(function () {
            console.log('Package "' + $scope.package.appID + '" saved!');
          });
      };

    }]);
