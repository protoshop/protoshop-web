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
                    var type = args.type, isComment = type === 'notes';
                    var newElement = JSON.parse(JSON.stringify(lib.data[type].init));
                    newElement.posX = isComment ? parseInt(args.posx - newElement.width * 0.5 - 101)
                        : parseInt(args.posx - 60).crop(0, 200);
                    newElement.posY = isComment ? parseInt(args.posy - newElement.height * 0.5 - 142)
                        : parseInt(args.posy - 22).crop(0, 436);

                    if (isComment){
                        newElement['cid'] = 'c_' + (+new Date());
                    }

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
            };
        }
    };
});