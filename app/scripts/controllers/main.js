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
      $scope.editStat.selectedScene = scene.id;
      // 自动选择该场景的第一个element
      if (scene.elements.length) {
        $scope.editStat.selectedElement = 0;
        $scope.editStat.selectedElementObj = currentElementObj();
      } else {
        $scope.editStat.selectedElement = null;
        $scope.editStat.selectedElementObj = null;
      }
      
    };

    /**
     * 选中一个元素
     * @func selectElement
     * @todo
     */
    $scope.selectElement = function (element) {
      // TODO
    };
    /**
     * 选中一个动作
     * @func selectAction
     * @todo
     */
    $scope.selectAction = function (action) {
      // TODO
    };

    /**
     * 增加一个hotspot动作
     * @func addHotspotAction
     */
    $scope.addHotspotAction = function () {
      for (var i = $scope.package.scenes.length - 1; i >= 0; i--) {
        if ($scope.package.scenes[i].id == $scope.editStat.selectedScene) {
          $scope.package.scenes[i].elements.push({
              type: 'hotspot',
              // 默认参数
              posX: '100px',
              posY: '300px',
              width: '120px',
              height: '42px',
              actions: []
          });
          $scope.editStat.selectedElement = $scope.package.scenes[i].elements.length-1;
          $scope.editStat.selectedElementObj = currentElementObj();
          break;
        }
      };
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

      var scene = $scope.findSceneById(action.target);

      if(scene) {
        action_text += scene.name;
      } else {
        action_text += '???';
      }
      
      return action_text;
    };

    $scope.renderHotspotStyle = function (element) {
      console.log(element);
      return {
        left: element.posX,
        top: element.posY,
        width: element.width,
        height: element.height,
        position: 'absolute'
      };
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
