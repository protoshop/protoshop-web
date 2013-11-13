'use strict';

angular.module('toHELL')
  .controller('MainCtrl', function ($scope) {
    $scope.project = {
      name: 'Demo 1',
      scenes: [
        {
          id: 'Scene 1',
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
  });
