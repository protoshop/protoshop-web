'use strict';

angular.module('toHELL')

/**
 * Parent Element accept adding children.
 */

    .directive('parentElement', function ($rootScope) {
        return {
            restrict: 'A',
            socpe:true,
            link: function (scope, el) {
                // Only 'scrollview' and 'view' can have child elements.
                if (scope.elem && !(scope.elem.type === 'notes' || scope.elem.type === 'scrollview' || scope.elem.type === 'view')) {
                    return;
                }

                // Handle Style
                var $el = angular.element(el);

                $el.on('dragover', function (ev) {
                    $el.addClass('dragover');
                    ev.stopPropagation();
                    ev.preventDefault();
                });

                $el.on('dragleave', function (ev) {
                    $el.removeClass('dragover');
                    ev.preventDefault();
                });

                // Handle Drop
                $el.on('drop', function (ev) {
                    var pos = angular.element(ev.target).offset();
                    ev.stopPropagation();
                    $el.removeClass('dragover');
                    if (ev.altKey){
                        var elem = JSON.parse(ev.originalEvent.dataTransfer.getData('originData'));
                        var ofs = JSON.parse(ev.originalEvent.dataTransfer.getData('ofs'));
                        elem.posX = ev.originalEvent.clientX - pos.left - ofs.ox + ev.target.scrollLeft;
                        elem.posY = ev.originalEvent.clientY - pos.top - ofs.oy + ev.target.scrollTop;
                        $rootScope.$broadcast('scene.copyElement', {
                            elem: elem,
                            wrapper: scope
                        });
                        return;
                    }

                    var newElemType = ev.originalEvent.dataTransfer.getData('type');
                    if (newElemType) {
                        $rootScope.$broadcast('scene.addElement', {
                            wrapper: scope,
                            type: newElemType,
                            posx: ev.originalEvent.clientX - pos.left + ev.target.scrollLeft,
                            posy: ev.originalEvent.clientY - pos.top + ev.target.scrollTop
                        });
                    }
                });

            }
        };
    });
