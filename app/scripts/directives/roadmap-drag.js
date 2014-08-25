'use strict';

angular.module('toHELL')

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

        function startDrag(e){
            targetElem = angular.element(e.target);
            var ofs = targetElem.parent().offset();
            $document.on('mousemove', move);
            startPoint.x = e.offsetX;
            startPoint.y = e.offsetY;
            startPoint.ox = ofs.left;
            startPoint.oy = ofs.top;
        }

        function move(e){
            var top = e.pageY - startPoint.y - startPoint.oy,
                left = e.pageX - startPoint.x - startPoint.ox,
                lines = targetElem.attr('data-lines').split(' '),
                id = targetElem.attr('id'),
                curId = id.match(/block-(\d+)/)[1],
                order = targetElem.attr('data-order'),
                height = parseInt(targetElem.height()),
                width = parseInt(targetElem.width());

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

            targetElem.css({
                top : top + 'px',
                left : left + 'px'
            });
        }
    });