/**
 * Created by yang.fei on 2014/8/19.
 */
'use strict';

angular.module('toHELL')
.controller('roadMapCTRL',['$scope','$location','$routeParams', 'accountService', 'backendService',
        function($scope, $location, $routeParams, accountService, backendService){
        $scope.$on('goview.edit', function () {
            $location.path('/package/'+$routeParams.pkgId);

        });

        $scope.scenes = localStorage.getItem('dataImgs' + $routeParams.pkgId).split('||');

        function getLinksTree(elements) {
            var links = [];
            var i = 0, len = elements.length, elem;
            for (; i < len; i++) {
                    elem = elements[i];
                    if (!!elem.jumpto && links.indexOf(elem.jumpto.target) == -1) {
                        links.push(elem.jumpto.target);
                    }

                    if (elem.elements) {
                        var arr = getLinksTree(elem.elements);
                        arr.forEach(function(link){
                            if (links.indexOf(link) == -1){
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
            $scope.scenesTree = scenes.map(function(scene){
                return {
                    name : scene.name,
                    id : scene.id,
                    links : getLinksTree(scene.elements),
                    order : scene.order
                }
            });
        });

        $scope.init = function(){
            var blocks = [], lines=[];
            $scope.scenesTree.forEach(function(tree,k){
                var links = tree.links;
                lines.push([[],[]]);
            });
        }
    }]);