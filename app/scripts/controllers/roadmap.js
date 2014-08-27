/**
 * Created by yang.fei on 2014/8/19.
 */
'use strict';

angular.module('toHELL')
    .controller('roadMapCTRL', ['$scope', '$location', '$routeParams', 'accountService', 'backendService',
        function ($scope, $location, $routeParams, accountService, backendService) {
            $scope.$on('goview.edit', function () {
                $location.path('/package/' + $routeParams.pkgId);

            });

            $scope.scenes = localStorage.getItem('dataImgs' + $routeParams.pkgId).split('||');

            function getLinksBlocks(elements) {
                var links = [];
                var i = 0, len = elements.length, elem;
                for (; i < len; i++) {
                    elem = elements[i];
                    if (!!elem.jumpto && links.indexOf(elem.jumpto.target) == -1) {
                        links.push(elem.jumpto.target);
                    }

                    if (elem.elements) {
                        var arr = getLinksBlocks(elem.elements);
                        arr.forEach(function (link) {
                            if (links.indexOf(link) == -1) {
                                links.push(link);
                            }
                        });
                    }
                }
                return links;
            }

            // 初始化roadMap节点
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
                        name: scene.name,
                        id: scene.id,
                        links: getLinksBlocks(scene.elements),
                        order: scene.order
                    }
                });

                $scope.lines = $scope.getLines($scope.scenesBlocks);
            });

            $scope.getLines = function (blocks) {
                var lines = [],keys=Object.keys(blocks);

                keys.forEach(function (key) {
                    var from = blocks[key], links = from.links, forder=from.order;
                    links.forEach(function(bid){
                        var to = blocks[bid],torder=to.order, x1, x2;
                        if (forder != torder){
                            x1 = forder < torder ? (forder+1)*200 : forder*200+40;
                            x2 = torder > forder ? torder*200+40 : (torder+1)*200;
                            lines.push([[x1, 142], [x2, 142]]);
                        }
                    });
                });

                return lines;
            }
        }]);