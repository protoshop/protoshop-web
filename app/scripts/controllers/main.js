'use strict';

angular.module('toHELL')
  .controller('PackageCTRL', ['$scope', function ($scope) {
    /**
     * 存储当前的编辑状态
     * @var {Object}
     */
    $scope.editStat = {
      selectedScene: 0, // NOTE: 这里是scene的id，不能直接作为索引使用
      selectedElement: null,
      selectedElementObj: null,
      selectedAction: null,
      selectedActionObj: null
    };
    /**
     * 存储整个工程的实时状态
     * @var {Object}
     */
    $scope.package = {
      appName: 'Demo HELL1',
      appIcon: 'images/icon-app-120.png',
      splash: {
        image: 'splash.png',
        delay: 500,
        transferType: ''
      },
      scenes: [
        {
          id: 0,
          order: 0,
          name: 'Scene 1',
          background: 'images/zzz-scene-thumb.png',
          elements: [
            {
              type: 'hotspot',
              posX: '100px',
              posY: '300px',
              width: '120px',
              height: '42px',
              actions: [
                {
                  type: 'jumpto',
                  target: 1,
                  transitionType: 'push',
                  transitionDirection: 'up',
                  transitionDelay: '0s',
                  transitionDuration: '3.25s'
                }
              ]
            }
          ]
        },
        {
          id: 1,
          order: 1,
          name: 'Scene 2',
          background: 'images/zzz-scene-thumb.png',
          elements: []
        },
        {
          id: 2,
          order: 2,
          name: 'Scene 3',
          background: '',
          elements: []
        }
      ]
    };

    /**
     * 选中一个场景
     * @func selectScene
     * @param {Scene} scene - 被选中的场景
     */
    $scope.selectScene = function (scene) {
      this.editStat.selectedScene = scene.id;
      // 清除掉之前可能有的其他元素、动作选择
      this.selectElement(null);
    };

    /**
     * 选中一个元素
     * @func selectElement
     * @param {number} element_index 该元素的索引值
     * @todo 目前考虑自动选中第一个action，时机成熟时移除
     */
    $scope.selectElement = function (element_index) {
      this.editStat.selectedElement = element_index;
      this.editStat.selectedElementObj = currentElementObj();
      // FIXME: 目前考虑自动选中第一个action，时机成熟时移除
      this.selectAction(0);
    };

    /**
     * 增加一个hotspot元素
     * @func addHotspotElement
     */
    $scope.addHotspotElement = function () {
      var scene = this.findSceneById(this.editStat.selectedScene);
      scene.elements.push({
          // 默认参数
          type: 'hotspot',
          posX: '100px',
          posY: '300px',
          width: '120px',
          height: '42px',
          actions: []
      });
      this.selectElement(scene.elements.length-1);
    };

    /**
     * 选中一个动作
     * @func selectAction
     * @param {number} action_index 该动作的索引值
     */
    $scope.selectAction = function (action_index) {
      var a_ = this.editStat;
      var b_ = a_.selectedElementObj;
      if (action_index == null || b_ == null) {
        a_.selectActionObj = a_.selectAction = null;
        return;
      }

      if (b_.actions.length > action_index) {
        a_.selectedActionObj = b_.actions[action_index];
        a_.selectedAction = action_index;
      } else {
        a_.selectedActionObj = null;
        a_.selectedAction = null;
      }
    };

    /**
     * 增加一个动作。该动作会直接增加在当前元素中。
     * @func addAction
     */
    $scope.addAction = function () {
      var element = this.editStat.selectedElementObj;
      element.actions.push({
        type: 'jumpto',
        target: null,
        transitionType: 'push',
        transitionDirection: 'up',
        transitionDelay: '0s',
        transitionDuration: '3.25s'
      });
      this.selectAction(element.actions.length-1);
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
    function findScene(key, value) {
      for (var i = this.scenes.length - 1; i >= 0; i--) {
        if (this.scenes[i][key] == value) {
          return this.scenes[i];
        }
      };
      return null;
    }

    // 快捷方法
    /**
     * 搜索特定id的场景
     * @func findSceneById
     * @param {number} id - 要搜索的id
     * @return {Scene|null} 如果找到则返回该场景对象，否则返回null
     */
     /**
     * 搜索特定order的场景
     * @func findSceneByOrder
     * @param {number} order - 要搜索的order
     * @return {Scene|null} 如果找到则返回该场景对象，否则返回null
     */
    $scope.findSceneById = findScene.bind($scope.package, 'id');
    $scope.findSceneByOrder = findScene.bind($scope.package, 'order');

    /**
    * 将一条Action渲染为文本信息
    * @func renderActionItem
    * @param {Action} action - 要渲染的action
    * @return {string} 文本信息
    */
    $scope.renderActionItem = function (action) {
      var action_text = '';
      switch (action.type) {
        case 'jumpto':
          action_text += 'Go To: ';
          break;
        default:
          action_text += 'Unknown Action: ';
      }

      var scene = this.findSceneById(action.target);

      if(scene) {
        action_text += scene.name;
      } else {
        action_text += '???';
      }
      
      return action_text;
    };

    /**
    * 返回一个元素的坐标样式信息
    * @func renderHotspotStyle
    * @param {Element} element - 要处理的元素
    * @return {Object} 样式信息，需包含left、top、width、height
    */
    $scope.renderHotspotStyle = function (element) {
      return {
        left: element.posX,
        top: element.posY,
        width: element.width,
        height: element.height
      };
    };

    /**
    * 返回一个场景的背景图。如果没有设置背景图则返回一张空白图。
    * @func renderSceneThumbById
    * @param {number} sid - 场景的id
    * @return {string} 背景图的路径。
    */
    $scope.renderSceneThumbById = function (sid) {
      var scene = this.findSceneById(sid);
      if(scene && scene.background.length) {
        return scene.background;
      } else {
        return 'images/dummy-scene-thumb.png';
      }
    }

    /**
    * 测试Transition方向是否已禁用
    * @func isTransDirDisabled
    * @param {Action} action - 要测试的Action
    * @return {bool}
    */
    $scope.isTransDirDisabled = function(action) {
      return action ? (action.transitionType == 'none') : false;
    };

    /**
    * transition的方式发生变化时调用此函数
    * @func onTransitionTypeChanged
    * @param {Action} action - 发生变化的的Action
    * @todo 目前没有transition从无到有的默认值，同时也就意味着没有“记忆”能力
    */
    $scope.onTransitionTypeChanged = function(action) {
      if (action.transitionType == 'none') {
        action.transitionDirection = 'none';
      } else {
        // TODO: 目前没有默认值，同时也就意味着没有“记忆”能力
      }
    };

    // 简化模板中的复杂寻值
    /**
    * 返回当前选中的元素
    * @private
    * @func currentElementObj
    * @return {Element|null} 如果存在被选中的，则返回该元素，否则返回null
    */
    function currentElementObj() {
      var scene = $scope.findSceneById($scope.editStat.selectedScene);
      if (!scene) {
        return null;
      }
      var elements = scene.elements;
      if (elements.length) {
        return elements[$scope.editStat.selectedElement];
      } else {
        return null;
      }
    };

    // TODO: 如果初始态不选中任何场景，则这里应该去掉
    $scope.selectScene($scope.package.scenes[0]); 

  }])
  .controller('PackageListCTRL', ['$scope', '$location', function ($scope, $location) {
    $scope.packageList = [
      {
        packageName: 'Jade',
        packageIcon: 'images/icon-app-120.png',
        modifyDate: '2013-10-27',
        changelog: [
          {
            by: 'guolei',
            note: '改了些颜色',
            date: '2013-10-24'
          }
        ]
      },
      {
        packageName: 'Jade',
        packageIcon: 'images/icon-app-120.png',
        modifyDate: '2013-10-27',
        changelog: []
      },
      {
        packageName: 'Mike',
        packageIcon: 'images/icon-app-120.png',
        modifyDate: '2013-10-27',
        changelog: [
          {
            by: 'guolei',
            note: '改了些颜色',
            date: '2013-10-24'
          },
          {
            by: 'guolei',
            note: '又改了些颜色',
            date: '2013-10-24'
          },
          {
            by: 'guolei',
            note: '最喜欢改颜色了',
            date: '2013-10-24'
          }
        ]
      },
      {
        packageName: 'Jade',
        packageIcon: 'images/icon-app-120.png',
        modifyDate: '2013-10-27',
        changelog: [
          {
            by: 'guolei',
            note: 'I see your true color.',
            date: '2013-10-24'
          }
        ]
      },
    ];

    $scope.editPackage = function (pkg) {
      console.log(pkg);
      $location.path('/package');
    }

    $scope.deletePackage = function(pkg){
      console.log(pkg);
    }

    $scope.showCreateDialog = false;
    $scope.toggleCreateDialog = function(){
      $scope.showCreateDialog = !$scope.showCreateDialog;
    }
  }]);
