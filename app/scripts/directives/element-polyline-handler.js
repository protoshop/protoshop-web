'use strict';
angular.module('toHELL')
/**
 * Element Rect Handler（界面元素拖拽控件） in polyline after before editor
 */
    .directive('polylineHandler', function ($document, uilib) {
        return {
            restrict: 'AE',
            replace: 'true',
            templateUrl: 'partials/element-polyline-handler.html',
            link: function (scope, el) {
                console.log(el.parent());
                el.on('drag dragstart dragmove', function($ev){
                    $ev.stopPropagation();
                    $ev.preventDefault();
                   return false;
                });

                el.parent().on('drag dragstart dragmove', function($ev){
                    $ev.stopPropagation();
                    $ev.preventDefault();
                    return false;
                });

                el.on('mousedown', function ($event) {
                    // 不接受非左键点击
                    if ($event.which !== 1) {
                        return;
                    }
                    // 记录初始状态
                    scope.origin = {
                        elemx: scope.elem.posX,
                        elemy: scope.elem.posY,
                        elemw: scope.elem.width,
                        elemh: scope.elem.height,
                        mousex: $event.clientX,
                        mousey: $event.clientY
                    };
                    scope.direction = $event.target.dataset.handle;
                    // 绑定

                    if ($event.shiftKey){
                        $document.one('mousemove', addNewLine);
                    }else{
                        $document.on('mousemove', updateElemRect);
                    }
                    $document.one('mouseup', unbindDragEvents);
                    $event.stopPropagation();
                });

                /**
                 * 添加新折线
                 */
                function addNewLine($ev){
                    scope.elem.elements = scope.elem.elements || [];
                    var type;

                    switch (scope.elem.type){
                        case 'hbefore':
                            type = 'vbefore';
                            break;
                        case 'vbefore':
                            type = 'hbefore';
                            break;
                        case 'hafter':
                            type = 'vafter';
                            break;
                        case 'vafter':
                            type = 'hafter';
                            break;
                    }

                    uilib.then(function(libs){
                        var element = JSON.parse(JSON.stringify(libs.data[type].init));
                            scope.elem.elements.push(element);
                    });
                }

                /**
                 * 根据拖拽事件更新元素宽高（以及位置）
                 * @param $ev
                 */
                function updateElemRect($ev) {
                    var deltaX = $ev.clientX - scope.origin.mousex;
                    var deltaY = $ev.clientY - scope.origin.mousey;
                    var wrapperSize = scope.elemData ? scope.elemData().contentSize : scope.$parent.$parent.size;


                    switch (scope.direction) {
                        case 'v-bf':
                            scope.elem.posY = scope.origin.elemy + deltaY;
                            scope.elem.height = scope.origin.elemh - deltaY;
                            break;
                        case 'v-af':
                            scope.elem.height = scope.origin.elemh + deltaY;
                            break;
                        case 'h-bf':
                            scope.elem.posX = scope.origin.elemx + deltaX;
                            scope.elem.width = Math.abs(scope.origin.elemw - deltaX);
                            break;
                        case 'h-af':
                            scope.elem.width = scope.origin.elemw + deltaX;
                            break;
                    }

                    scope.$apply();
                }

                /**
                 * 清理拖拽相关事件
                 */
                function unbindDragEvents() {
                    $document.off('mousemove', updateElemRect);
                }

                // 阻止控件元素上的点击事件冒泡
                el.on('click', function (event) {
                    event.stopPropagation();
                });
            }
        };
    });