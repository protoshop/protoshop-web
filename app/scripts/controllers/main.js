'use strict';

angular.module('toHELL')
  .controller('PackageCTRL', ['$scope', function ($scope) {
    $scope.editStat = {
      selectedScene: 0, // NOTE: 这里是scene的id，不能直接作为索引使用
      selectedElement: null,
      selectedElementObj: null,
      selectedAction: null,
      selectedActionObj: null
    };
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
              type: 'button',
              posX: 100,
              posY: 300,
              width: 120,
              height: 42,
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

    $scope.selectScene = function (scene) {
      console.log('selectScene');
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

    $scope.selectElement = function (element) {
      // TODO
    };

    $scope.selectAction = function (action) {
      // TODO
    };

    $scope.addHotspotAction = function () {
      for (var i = $scope.package.scenes.length - 1; i >= 0; i--) {
        if ($scope.package.scenes[i].id == $scope.editStat.selectedScene) {
          $scope.package.scenes[i].elements.push({
              type: 'hotspot',
              // 默认参数
              posX: 100,
              posY: 300,
              width: 120,
              height: 42,
              actions: []
          });
          $scope.editStat.selectedElement = $scope.package.scenes[i].elements.length-1;
          $scope.editStat.selectedElementObj = currentElementObj();
          break;
        }
      };
    };

    var findScene = function (key, value) {
      for (var i = this.scenes.length - 1; i >= 0; i--) {
        if (this.scenes[i][key] == value) {
          return this.scenes[i];
        }
      };
      return null;
    }

    // 快捷方法
    $scope.findSceneById = findScene.bind($scope.package, 'id');
    $scope.findSceneByOrder = findScene.bind($scope.package, 'order');

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

    // 简化模板中的复杂寻值
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
