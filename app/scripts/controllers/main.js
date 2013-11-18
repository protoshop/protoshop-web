'use strict';

angular.module('toHELL')
  .controller('PackageCTRL',['$scope', function ($scope) {
    $scope.projectStat = {
      selectedScene: 0
    };
    $scope.project = {
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
          background: 'images/zzz-scene-thumb.png',
          elements: [
            {
              type: 'button',
              size: [80, 30],  // width, height
              position: [0,0], // x, y
              actions: [{
                type: 'jumpto',
                target: 'Scene 2',
                transition: '',
                direction: 'left'
              }]
            }
          ]
        },
        {
          order: 1,
          name: 'Scene 2',
          background: 'images/zzz-scene-thumb.png',
          elements: [
            {
              type: 'button',
              size: [80, 30],  // width, height
              position: [0,0], // x, y
              actions: {
                jumpto: 'Scene 2',
                transition: '',
                direction: 'left'
              }
            }
          ]
        },
        {
          order: 2,
          name: 'Scene 3',
          background: '',
          elements: [
            {
              type: 'button',
              size: [80, 30],  // width, height
              position: [0,0], // x, y
              actions: {
                jumpto: 'Scene 2',
                transition: '',
                direction: 'left'
              }
            }
          ]
        }
      ]
    };

    $scope.selectScene = function(scene){
      $scope.projectStat.selectedScene = scene.order;
    };
  }])
  .controller('PackageListCTRL',['$scope',function($scope){
    $scope.aaa = 'adsf';
  }]);
