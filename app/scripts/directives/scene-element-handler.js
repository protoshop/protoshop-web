'use strict';
angular.module('toHELL')
/**
 * Element Rect Handler（界面元素拖拽控件） in scene editor
 */
    .directive('elementHandler', function ($document) {
        return {
            restrict: 'AE',
            replace: 'true',
            templateUrl: 'partials/scene-element-handler.html',
            link: function (scope, el) {
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
                    $document.on('mousemove', updateElemRect);
                    $document.one('mouseup', unbindDragEvents);
                    $event.stopPropagation();
                });
                /**
                 * 根据拖拽事件更新元素宽高（以及位置）
                 * @param $ev
                 */
                function updateElemRect($ev) {
                    var deltaX = $ev.clientX - scope.origin.mousex;
                    var deltaY = $ev.clientY - scope.origin.mousey;
                    var wrapperSize = scope.elemData ? scope.elemData().contentSize : scope.$parent.$parent.size;

                    if ('notes line'.split(' ').indexOf(scope.elem.type) >= 0){
                        switch (scope.direction) {
                            case 'up' :
                                scope.elem.posY = scope.origin.elemy + deltaY;
                                scope.elem.height = scope.origin.elemh - deltaY;
                                break;
                            case 'down' :
                                scope.elem.height = (scope.origin.elemh + deltaY);
                                break;
                            case 'left':
                                scope.elem.posX = scope.origin.elemx + deltaX;
                                scope.elem.width = scope.origin.elemw - deltaX;
                                break;
                            case 'right':
                                scope.elem.width = (scope.origin.elemw + deltaX);
                                break;
                        }
                    }else{
                        switch (scope.direction) {
                            case 'up':
                                deltaY = deltaY.crop(0 - scope.origin.elemy, scope.origin.elemh);
                                scope.elem.posY = scope.origin.elemy + deltaY;
                                scope.elem.height = scope.origin.elemh - deltaY;
                                break;
                            case 'down':
                                scope.elem.height = (scope.origin.elemh + deltaY).crop(0, wrapperSize.height - scope.origin.elemy);
                                break;
                            case 'left':
                                deltaX = deltaX.crop(0 - scope.origin.elemx, scope.origin.elemw);
                                scope.elem.posX = scope.origin.elemx + deltaX;
                                scope.elem.width = scope.origin.elemw - deltaX;
                                break;
                            case 'right':
                                scope.elem.width = (scope.origin.elemw + deltaX).crop(0, wrapperSize.width - scope.origin.elemx);
                                break;
                        }
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
    })
/**
 * Element Content Rect Handler（界面内容元素拖拽控件）
 */
    .directive('elementContentHandler', function ($document) {
        return {
            restrict: 'AE',
            replace: 'true',
            templateUrl: 'partials/scene-element-handler.html',
            link: function (scope, el) {
                el.on('mousedown', function ($event) {
                    // 不接受非左键点击
                    if ($event.which !== 1) {
                        return;
                    }
                    // 记录初始状态
                    scope.origin = {
                        elemw: scope.elem.contentSize.width,
                        elemh: scope.elem.contentSize.height,
                        mousex: $event.clientX,
                        mousey: $event.clientY
                    };
                    scope.direction = $event.target.dataset.handle;
                    // 绑定
                    $document.on('mousemove', updateElemRect);
                    $document.one('mouseup', unbindDragEvents);
                    $event.stopPropagation();
                });
                /**
                 * 根据拖拽事件更新元素宽高（以及位置）
                 * @param $ev
                 */
                function updateElemRect($ev) {
                    var deltaX = $ev.clientX - scope.origin.mousex;
                    var deltaY = $ev.clientY - scope.origin.mousey;
                    switch (scope.direction) {
                        case 'down':
                            scope.elem.contentSize.height = scope.origin.elemh + deltaY;
                            break;
                        case 'right':
                            scope.elem.contentSize.width = scope.origin.elemw + deltaX;
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