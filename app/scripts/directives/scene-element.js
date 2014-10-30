'use strict';
angular.module('toHELL')
/**
 * Element（界面元素控件） in scene editor
 */
    .directive('sceneElement', function ($rootScope, $document, editService) {
        return {
            restrict: 'AE',

            controller: function ($scope, ENV) {
                // Scene 的编辑区的基础环境信息。 TODO：stage 的宽和高应该取自工程配置
                $scope.size = $scope.elem;
                $scope.fileRoot = ENV.pkgRoot + $scope.package.appID + '/';
                $scope.scenes = $scope.package.scenes;
            },
            link: function (scope, el, attr) {
                /**
                 * 当鼠标点下时，
                 * 记录控件和鼠标指针的当前位置，开始监听拖拽相关事件
                 */

                scope.psize = scope.package.appPlatform === 'ios' ? {
                    width: 320,
                    height: 568
                } : {
                    width: 400,
                    height: 640
                };

                var transData,parent;

                /**
                 * 复制
                 */
                scope.$on('copy-element-' + scope.elem.$$hashKey, function(){
                    parent=scope;

                    while(parent=parent.$parent){
                        if (parent.hasOwnProperty('elem') && scope.elem != parent.elem && parent.elem.elements){
                            break;
                        }
                    }
                    transData = JSON.parse(JSON.stringify(scope.editStat.selectedElement));
                    editService.copyElemData(transData);
                    transData.posX = (parent ? parent.elem.width : scope.psize.width - transData.width)*0.5;
                    transData.posY = (parent ? parent.elem.height : scope.psize.height - transData.height)*0.5;
                });

                /**
                 * 粘贴
                 */
                scope.$on('paste-element-' + scope.elem.$$hashKey, function(){
                    if (!!transData) {
                        $rootScope.$broadcast('scene.copyElement', {
                            elem: transData,
                            wrapper: parent
                        });
                    }
                    transData = null;
                });

                function bindDragHandler($ev) {
                    // 过滤掉元素附属编辑框上的点击事件
                    if (!$ev.target.classList.contains('scene-element')&&!$ev.target.classList.contains('move-anchor')) {
                        return;
                    }
                    // 不接受非左键点击
                    if ($ev.which !== 1 || $ev.altKey) {
                        return;
                    }

                    // 选中此控件
                    scope.selectElement && scope.selectElement(scope.elem);

                    scope.$apply();
                    // 记录控件和鼠标初始位置
                    scope.origin = {
                        posx: scope.elem.posX,
                        posy: scope.elem.posY,
                        mousex: $ev.clientX,
                        mousey: $ev.clientY
                    };
                    // 绑定
                    if (!scope.elem.type.match(/^[vh](?:before|after)$/g)){
                        $document.on('mousemove', updateElemPos);
                    }
                    $document.one('mouseup', unbindDragEvents);
                    $ev.stopPropagation();
                }

                var targetEl = scope.elem.type == 'polyline' ? el.find('.move-anchor') : el;
                el.on('mousedown', bindDragHandler);

                /**
                 * 根据拖拽事件，更新控件的位置信息
                 */
                function updateElemPos($ev) {
                    // 设置鼠标样式
                    $document.find('body').css('cursor', 'move');
                    // 拖拽范围
                    var zoneSize = scope.elemData ? scope.elemData().contentSize : scope.$parent.size;
                    var maxX = zoneSize.width - scope.elem.width;
                    var minX = 0;
                    var maxY = zoneSize.height - scope.elem.height;
                    var minY = 0;
                    //
                    if (scope.elem.wrapperSize) {
                        scope.elem.posX = (scope.origin.posx + $ev.clientX - scope.origin.mousex).crop(scope.elem.wrapperSize.width, minX);
                        scope.elem.posY = (scope.origin.posy + $ev.clientY - scope.origin.mousey).crop(scope.elem.wrapperSize.height, minY);
                    } else {
                        scope.elem.posX = (scope.origin.posx + $ev.clientX - scope.origin.mousex).crop(maxX, minX);
                        scope.elem.posY = (scope.origin.posy + $ev.clientY - scope.origin.mousey).crop(maxY, minY);
                    }
                    scope.$apply();
                }

                /**
                 * 清理拖拽相关事件
                 */
                function unbindDragEvents($ev) {
                    // 清除鼠标样式
                    $document.find('body').css('cursor', 'auto');
                    $document.off('mousemove', updateElemPos);
                }

                // 阻止控件元素上的点击事件冒泡
                el.on('click', function (event) {
                    event.stopPropagation();
                });
            }
        };
    });