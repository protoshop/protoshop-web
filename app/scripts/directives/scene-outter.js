/**
 * Created by muyi on 14-9-30.
 */
'use strict';

angular.module('toHELL').directive('sceneOutter', function($rootScope){
    return {
        restrict : 'A',
        replace : true,
        scope : true,
        link : function(scope, el, attr){
            console.log(el);
            var $el = angular.element(el);

            $el.on('dragover', function (ev) {
                ev.stopPropagation();
                ev.preventDefault();
            });

            $el.on('dragleave', function (ev) {
                ev.preventDefault();
            });

            $el.on('drop', function(ev){
                var ofs = {
                    ox :ev.originalEvent.offsetX,
                    oy : ev.originalEvent.offsetY
                }

                ev.stopPropagation();
                var type = ev.originalEvent.dataTransfer.getData('type');
                if (type=='notes') {
                    $rootScope.$broadcast('scene.addElement', {
                        wrapper: scope,
                        type: type,
                        posx: ev.originalEvent.offsetX,
                        posy: ev.originalEvent.offsetY
                    });
                }
            });
        }
    }
});