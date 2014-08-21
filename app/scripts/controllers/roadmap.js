/**
 * Created by yang.fei on 2014/8/19.
 */
'use strict';

angular.module('toHELL')
.controller('roadMapCTRL',['$rootScope','$scope','$location','$routeParams', function($rootScope, $scope, $location, $routeParams){
        $scope.$on('goview.edit', function () {
            $location.path('/package/'+$routeParams.pkgId);

        });
        $scope.sences = localStorage.getItem('dataImgs' + $routeParams.pkgId).split('||');
    }]);