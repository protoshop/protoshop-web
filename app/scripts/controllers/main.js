'use strict';

angular.module('toHELL')
  .controller('ProjectCTRL',['$scope', function ($scope) {
    $scope.projectStat = {
      selectedScene: 0
    };
    $scope.project = {
      name: 'Demo 1',
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
              actions: {
                jumpto: 'Scene 2',
                transition: '',
                direction: 'left'
              }
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
  }]);
