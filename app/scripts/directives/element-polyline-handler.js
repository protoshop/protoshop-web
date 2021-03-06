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

                var anchor, childElements,child;

                // 禁止掉浏览拖放
                el.on('drag dragstart dragmove', function ($ev) {
                    $ev.stopPropagation();
                    $ev.preventDefault();
                    return false;
                });

                el.parent().on('drag dragstart dragmove', function ($ev) {
                    $ev.stopPropagation();
                    $ev.preventDefault();
                    return false;
                });

                el.on('mousedown', function ($event) {
                    // 不接受非左键点击
                    if ($event.which !== 1) {
                        return;
                    }

                    // 折线触控点
                    anchor = el.find('i');

                    // 子折线
                    childElements = scope.elem.elements;
                    child = childElements && childElements[0];
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

                el.on('click', addNewLine);

                el.on('mouseover', function ($event) {
                    // 按shift鼠标变形
                    if ($event.shiftKey && (!scope.elem.elements || scope.elem.elements.length == 0)) {
                        el.find('i').css('cursor', 'pointer');
                    }
                });

                el.on('mouseout', function(){
                    // 恢复鼠标
                    el.find('i').css('cursor', '');
                });

                /**
                 * 添加新折线
                 */
                function addNewLine($ev) {
                    // 按shift添加，且只能添加一条折线
                    if ($ev.shiftKey && (!scope.elem.elements
                        || scope.elem.type == 'polyline' && scope.elem.elements.length<2
                        || scope.elem.elements.length == 0)) {
                        scope.elem.elements = scope.elem.elements || [];
                        var type, elem = scope.elem, etype = elem.type, X=0, Y= 0, target=$ev.target;

                        switch (etype) {
                            case 'polyline':
                                if (scope.direction == 'v-bf'){
                                    type = 'hbefore';
                                    Y = 0;
                                    X = -40;
                                }else if(scope.direction == 'v-af'){
                                    type = 'hafter';
                                    Y = elem.height;
                                    X = 0;
                                }
                                break;
                            case 'hbefore':
                                type = 'vbefore';
                                X = elem.posX < 0 ? 0 : elem.width;
                                Y = -40;
                                break;
                            case 'vbefore':
                                type = 'hbefore';
                                Y = elem.posY < 0 ? 0 : elem.height;
                                X = -40;
                                break;
                            case 'hafter':
                                type = 'vafter';
                                X = elem.posX < 0 ? 0 : elem.width;
                                break;
                            case 'vafter':
                                type = 'hafter';
                                Y = elem.posY < 0 ? 0 : elem.height;
                                break;
                        }

                        uilib.then(function (libs) {
                            var element = JSON.parse(JSON.stringify(libs.data[type].init));
                            element.posX = X;
                            element.posY = Y;
                            scope.elem.elements.push(element);
                        });
                    }
                }

                /**
                 * 根据拖拽事件更新元素宽高（以及位置）
                 * @param $ev
                 */
                function updateElemRect($ev) {
                    $ev.stopPropagation();
                    var deltaX = $ev.clientX - scope.origin.mousex;
                    var deltaY = $ev.clientY - scope.origin.mousey;
                    var Y,X;

                    /**
                     * v:纵向  h:横向  bf:before  af:after
                     */
                    switch (scope.direction) {
                        case 'v-bf':
                        case 'v-af':
                            if (scope.elem.type == 'polyline'){
                                if (scope.direction == 'v-bf'){
                                    Y = scope.origin.elemh - deltaY;
                                    childElements[1].posY = Y;
                                    scope.elem.posY = scope.origin.elemy + deltaY;
                                }else if(scope.direction == 'v-af'){
                                    Y = scope.origin.elemh + deltaY;
                                    childElements[1].posY = Y;
                                }

                            }else{
                                // 处理垂直方向的折线
                                if (scope.origin.elemy >= 0){
                                    Y = scope.origin.elemh + deltaY;
                                }else if(scope.origin.elemy < 0){
                                    Y = -1 * (scope.origin.elemh - deltaY);
                                }

                                if (Y>=0){
                                    scope.elem.posY = 0;
                                    anchor.css('top', '100%');
                                    if (child){
                                        child.posY = Y;
                                    }
                                }else{
                                    scope.elem.posY = Y;
                                    anchor.css('top', 0);
                                    if (child){
                                        child.posY = 0;
                                    }
                                }
                            }

                            scope.elem.height = Math.abs(Y);
                            break;
                        case 'h-bf':
                        case 'h-af':
                            // 处理水平方向人折线
                            if (scope.origin.elemx >= 0){
                                X = scope.origin.elemw + deltaX;
                            }else if(scope.origin.elemx < 0){
                                X = -1 * (scope.origin.elemw - deltaX);
                            }

                            if (X>=0){
                                scope.elem.posX = 0;
                                anchor.css('left', '100%');
                                if (child){
                                    child.posX = X;
                                }
                            }else{
                                scope.elem.posX = X;
                                anchor.css('left', 0);
                                if (child){
                                    child.posX = 0;
                                }
                            }
                            scope.elem.width = Math.abs(X);
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