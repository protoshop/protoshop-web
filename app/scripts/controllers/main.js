'use strict';

angular.module('toHELL')
  .controller('PackageCTRL', ['$scope', function ($scope) {
    $scope.editStat = {
      selectedScene: 0,
      selectedElement: null
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
                  target: 'scene 2',
                  transitionType: 'push',
                  transitionDirection: 'up',
                  transitionDelay: 0,
                  transitionDuration: 0.25
                }
              ]
            }
          ]
        },
        {
          order: 1,
          name: 'Scene 2',
          background: 'images/zzz-scene-thumb.png',
          elements: []
        },
        {
          order: 2,
          name: 'Scene 3',
          background: '',
          elements: []
        }
      ]
    };

    $scope.selectScene = function (scene) {
      $scope.editStat.selectedScene = scene.order;
    };
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
  }]);
