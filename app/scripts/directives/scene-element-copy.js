'use strict';

angular.module('toHELL')

/**
 * drag copy element
 */

    .directive('copyElement', function ($document, $rootScope) {
        return {
            restrict: 'AE',
            scope: true,
            controller : function($scope, $element){
                $element.on('evt:copy', function($event){
                    console.log($event);
                    console.log($scope);
                });
            },
            link: function (scope, el) {
                el.on('mousedown', bindDragHandler);
                el.on('mouseup', unBindDragHandler);

                /**
                 * 监听拖拽复制事件
                 */
                function bindDragHandler(ev) {
                    el.focus();
                    if (ev.altKey) {
                        el.attr('draggable', true).on('dragstart', dragCopyElement);
                    }
                }

                // 取消监听
                function unBindDragHandler() {
                    el.removeAttr('draggable').off('dragstart', dragCopyElement);
                }

                // 只复制数据结构，要循环删除$$hashkey
                function deepCfg(obj) {
                    var keys = Object.keys(obj);
                    keys.forEach(function deep(key) {
                        if (key === '$$hashKey') {
                            delete obj[key];
                            return;
                        }
                        if (Array.isArray(obj[key])) {
                            obj[key].forEach(function (p) {
                                deepCfg(p);
                            });
                        }
                    });
                }

                // 拖拽事件
                function dragCopyElement(ev) {
                    ev.stopPropagation();
                    var elem = JSON.parse(JSON.stringify(scope.elem));
                    var ofs = {
                        ox: ev.originalEvent.offsetX,
                        oy: ev.originalEvent.offsetY
                    };
                    deepCfg(elem);
                    // 填充拖拽数据
                    ev.originalEvent.dataTransfer.setData('originData', JSON.stringify(elem));
                    ev.originalEvent.dataTransfer.setData('ofs', JSON.stringify(ofs));
                }
            }
        }
    });