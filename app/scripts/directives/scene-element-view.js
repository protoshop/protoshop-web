'use strict';
angular.module('toHELL')
/**
 * Element（界面元素控件） in scene editor
 */
    .directive('elementView', function () {
        return {
            restrict: 'AE',
            replace: true,
            templateUrl: 'partials/scene-element-view.html',
            require: 'ngModel',
            link: function (scope, el, attr, ngModel) {
                // 段落文字在当前元素内编辑
                if (scope.elem.type == 'paragraph') {
                    el.parent('.scene-element').on('dblclick', function (e) {
                        e.stopPropagation();

                        el.css('pointer-events', 'auto');

                        // 真正的内容元素
                        var para = el.find('.elem-text-content');
                        para.css('pointer-events', 'auto')
                            // 监听内容编辑
                            .on('input', function () {
                                scope.$apply(read);
                            })
                            .on('blur', function () {
                                para.css('pointer-events', 'none')
                                    .attr('contenteditable', false);
                                el.css('pointer-events', 'none');
                            })
                            .attr('contenteditable', true).focus();

                        function read() {
                            var html = para.html();
                            ngModel.$setViewValue(html);
                        }
                    });
                }
            }
        };
    });