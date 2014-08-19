/**
 * Created by yang.fei on 2014/8/19.
 */
'use strict';
var aaa;
angular.module('toHELL')
    .controller('testListCTRL',['$rootScope','$scope','$location', function($rootScope,$scope, $location){
        $scope.scenes = [
            {
                text : '场景一',
                color : '#f99'
            },
            {
                text : '场景二',
                color : '#f79'
            },
            {
                text : '场景三',
                color : '#f59'
            },
            {
                text : '场景四',
                color : '#f39'
            }
        ];

        $scope.showImgs = function(){
            var lis = angular.element('#scenes li'),images=[],len=lis.length,l = $location;
            lis.each(function(i,item){
                html2canvas(item, {
                    onrendered: function(canvas) {
                        var img = new Image();
                        img.src = canvas.toDataURL("image/png");
                        $('.imgs').append(img);
                        images.push(canvas.toDataURL("image/png"));
                        if(i==len-1){
                            $scope.$apply(function () {
                                $location.path('roadmap/123');
                                $rootScope.images = images;
                            });
                        }
                    }
                });
            });

//            setTimeout(function(){
//                $scope.$apply(function () {
//                    $location.path('roadmap/123');
//                });
//            },2000);
        }
    }]);