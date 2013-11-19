'use strict';

angular.module('toHELL')
  .controller('PackageCTRL', ['$scope', function ($scope) {
    $scope.editStat = {
      selectedScene: 0,
      selectedElement: null
    };
    $scope.package = {
      appName: 'Demo HELL1',
      appIcon: '',
      splash: {
        image: 'splash.png',
        delay: 500,
        transferType: ''
      },
      scenes: [
        {
          order: 0,
          name: 'Scene 1',
          icon: 'images/icon-app-120.png',
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
  .controller('PackageListCTRL', ['$scope', function ($scope) {
    $scope.aaa = 'adsf';
  }]);
