'use strict';

angular.module('toHELL')

/**
 * Parent Element accept adding children.
 */

    .directive('copyElement', function ($rootScope) {
        return {
            restrict: 'AE',
            scope: true,
            link: function (scope, el) {
                el.on('mousedown', bindDragHandler);
                el.on('mouseup', unBindDragHandler);

                function bindDragHandler(ev){
                    if (ev.altKey){
                        el.attr('draggable', true).on('dragstart', bindCopyElement);
                    }
                }

                function unBindDragHandler(){
                    el.removeAttr('draggable').off('dragstart', bindCopyElement);
                }

                function deepCfg(obj){
                    var keys = Object.keys(obj);
                    keys.forEach(function deep(key){
                        if (key === '$$hashKey'){
                            delete obj[key];
                            return;
                        }
                        if (Array.isArray(obj[key])){
                            obj[key].forEach(function(p){
                                deepCfg(p);
                            });
                        }
                    });
                }

                function bindCopyElement(ev) {
                    var elem = JSON.parse(JSON.stringify(scope.elem));
                    var ofs = {
                        ox : ev.originalEvent.offsetX,
                        oy : ev.originalEvent.offsetY
                    }
                    deepCfg(elem);
                    ev.originalEvent.dataTransfer.setData('originData', JSON.stringify(elem));
                    ev.originalEvent.dataTransfer.setData('ofs', JSON.stringify(ofs));
                }
            }
        }
    });