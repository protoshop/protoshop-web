'use strict';

angular.module('toHELL')
/**
 * RoadMap Drag directive
 */
    .directive('roadmapDrag', function ($document) {
        var targetElem,
            startPoint = {
                x : 0,
                y : 0,
                ox : 0,
                oy : 0
            };
        return {
            restrict: 'A',
            scope: true,
            link : function(scope, elem){
                elem.on('mousedown', startDrag);
                $document.on('mouseup', function(){
                    $document.off('mousemove', move);
                });
            }
        };

        // 开始拖动block
        function startDrag(e){
            targetElem = angular.element(e.target);
            var ofs = targetElem.parent().offset();
            $document.on('mousemove', move);
            startPoint.x = e.offsetX;
            startPoint.y = e.offsetY;
            startPoint.ox = ofs.left;
            startPoint.oy = ofs.top;
        }

        // 拖动block动作
        function move(e){
            var top = e.pageY - startPoint.y - startPoint.oy,
                left = e.pageX - startPoint.x - startPoint.ox,
                lines = targetElem.attr('data-lines').split(' '),
                id = targetElem.attr('id'),
                curId = id.match(/block-(\d+)/)[1],
                order = targetElem.attr('data-order'),
                height = parseInt(targetElem.height()),
                width = parseInt(targetElem.width());

            // 移动线
            lines.forEach(function(line){
                line = line.split('-');
                var dir = line[0], lid = line[1],line, nextElem=angular.element('#block-'+lid),
                    norder=nextElem.attr('data-order');
                if (dir === 'to'){
                    line = angular.element('#from-'+curId+'-to-'+lid);
                    line.attr({
                        x1 : order > norder ? left : left+width,
                        y1 : top + height * 0.5
                    });
                }else if (dir === 'from'){
                    line = angular.element('#from-'+lid+'-to-'+curId);
                    line.attr({
                        x2 : order > norder ? left : left+width,
                        y2 : top + height * 0.5
                    });
                }
            });

            // 移动block
            targetElem.css({
                top : top + 'px',
                left : left + 'px'
            });
        }
    });

    // 自定义指令处理svg的attribute报错问题
    angular.forEach(['x1', 'y1', 'x2', 'y2'], function(name) {
        var ngName = 'ng' + name[0].toUpperCase() + name.slice(1);
        angular.module('toHELL').directive(ngName, function() {
            return function(scope, element, attrs) {
                attrs.$observe(ngName, function(value) {
                    attrs.$set(name, value);
                })
            };
        });
    });