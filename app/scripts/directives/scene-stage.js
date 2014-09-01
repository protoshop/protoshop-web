'use strict';
angular.module('toHELL').directive('sceneStage', function ($rootScope, uilib) {
    return {
        restrict: 'A',
        replace: true,
        templateUrl: 'partials/scene-stage.html',
        scope: true,
        link: function (scope) {
            // Handle Event 'scene.addElement'
            scope.$on('scene.addElement', function (event, args) {
                uilib.then(function (lib) {
                    var newElement = JSON.parse(JSON.stringify(lib.data[args.type].init));
                    newElement.posX = parseInt(args.posx - 60).crop(0, 200);
                    newElement.posY = parseInt(args.posy - 22).crop(0, 436);
                    var host = args.wrapper.elem || scope.editStat.selectedScene;
                    host.elements = host.elements || [];
                    host.elements.push(newElement);
                });
            });

            // handle Event 'scene.copyElement'
            scope.$on('scene.copyElement', function ($event, args) {
                var host = args.wrapper.elem || scope.editStat.selectedScene;
                    host.elements = host.elements || [];
                    host.elements.push(args.elem);
                    scope.$apply();
            });

            scope.selectElement = function (elemObj) {
                scope.editStat.selectedElement = elemObj;
                console.log('select');
            };
        }
    };
});