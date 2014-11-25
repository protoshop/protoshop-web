'use strict';
angular.module('toHELL').directive('sceneStage', function ($rootScope, uilib, editService) {
    return {
        restrict: 'EA',
        replace: true,
        templateUrl: 'partials/scene-stage.html',
        scope: true,
        link: function (scope) {
            // Handle Event 'scene.addElement'
            scope.$on('scene.addElement', function (event, args) {
                uilib.then(function (lib) {
                    var type = args.type, isComment = type === 'notes',
                        // 辅助工具可以拖动到手机舞台外面
                        isAssists = 'vline line polyline notes'.split(' ').indexOf(type) >= 0;
                    var newElement = JSON.parse(JSON.stringify(lib.data[type].init));
                    newElement.posX = isAssists ? parseInt(args.posx - newElement.width * 0.5 - 101)
                        : parseInt(args.posx - 60).crop(0, 200);
                    newElement.posY = isAssists ? parseInt(args.posy - newElement.height * 0.5 - 142)
                        : parseInt(args.posy - 22).crop(0, 436);

                    /*if (isComment){
                        newElement['cid'] = 'c_' + (+new Date());
                    }*/

                    var host = args.wrapper.elem || scope.editStat.selectedScene;
                    host.elements = host.elements || [];
                    host.elements.push(newElement);
                    /*if (isComment) {
                        scope.editStat.comments = editService.getComments(scope.editStat.selectedScene);
                    }*/
                });
            });

            // handle Event 'scene.copyElement'
            scope.$on('scene.copyElement', function ($event, args) {
                var newElement=args.elem, isComment=newElement.type == 'notes';
                if (isComment){
                    newElement['cid'] = 'c_' + (+new Date());
                    scope.editStat.comments = editService.getComments(scope.editStat.selectedScene);
                }
                var host = args.wrapper && args.wrapper.elem || scope.editStat.selectedScene;
                    host.elements = host.elements || [];
                    host.elements.push(newElement);
                if (isComment) {
                    scope.editStat.comments = editService.getComments(scope.editStat.selectedScene);
                }
                    scope.$apply();
            });

            scope.selectElement = function (elemObj) {
                scope.editStat.selectChildElement = null;
                scope.editStat.selectedElement = elemObj;
            };
        }
    };
});