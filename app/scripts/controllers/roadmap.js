/**
 * Created by yang.fei on 2014/8/19.
 */
'use strict';

angular.module('toHELL')
    .controller('roadMapCTRL', ['$scope', '$location', '$routeParams', 'ENV','accountService', 'backendService',
        function ($scope, $location, $routeParams, ENV, accountService, backendService) {
            $scope.fileRoot = ENV.pkgRoot + $routeParams.pkgId + '/';
            $scope.$on('goview.edit', function () {
                $location.path('/package/' + $routeParams.pkgId);

            });

            //$scope.scenes = localStorage.getItem('dataImgs' + $routeParams.pkgId).split('||');

            function getBlocks(elements) {
                var links = [];
                var i = 0, len = elements.length, elem, jumpto;
                for (; i < len; i++) {
                    elem = elements[i];
                    jumpto = elem.jumpto;
                    if (!!jumpto && !!jumpto.target && links.indexOf(jumpto.target) == -1) {
                        links.push(jumpto.target);
                    }

                    if (elem.elements) {
                        var arr = getBlocks(elem.elements);
                        arr.forEach(function (link) {
                            if (links.indexOf(link) == -1 && link !='') {
                                links.push(link);
                            }
                        });
                    }
                }
                return links;
            }

            backendService.getPackage({
                pkgId: $routeParams.pkgId,
                token: accountService.getLoggedInUser().token
            }, function (result) {
                var _package = result[0];
                var scenes = _package.scenes;
                $scope.package = _package;
                $scope.scenesBlocks = {};
                scenes.forEach(function (scene) {
                    $scope.scenesBlocks[scene.id] = {
                        links: getBlocks(scene.elements),
                        order: scene.order,
                        scene : scene,
                        id : scene.id
                    }
                });

                $scope.lines = getLines($scope.scenesBlocks);
            });

            function getLines(blocks) {
                var lines = [], keys = Object.keys(blocks), linesInfo=[];
                keys.forEach(function (key) {
                    var from = blocks[key], links = from.links || [], forder = from.order, fid = from.id;
                    from.lines = from.lines || [];
                    links.forEach(function (bid) {
                        var to =blocks[bid], torder = to.order, x1, x2, tid = to.id;
                        to.lines=to.lines||[];
                        x1 = forder < torder ? (forder + 1) * 200 : forder * 200 + 40;
                        x2 = forder < torder ? torder * 200 + 40 : (torder + 1) * 200;

                        // 两个block之间只存在一条关系线
                        if (forder != torder && linesInfo.indexOf(fid + '-' + tid) == -1 && linesInfo.indexOf(tid + '-' + fid) == -1) {
                            lines.push({
                                id: 'from-' + fid + '-to-' + tid,
                                from: [x1, 128],
                                to: [x2, 128]
                            });
                            from.lines.push('to-' + tid);
                            to.lines.push('from-' + fid);
                            linesInfo.push(fid + '-' + tid, tid + '-' + fid);
                        }

                    });
                });

                return lines;
            }
        }]);