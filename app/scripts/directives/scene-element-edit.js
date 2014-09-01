'use strict';

angular.module('toHELL')

/**
 * Element Editor in scene editor
 */

    .directive('elementEdit', function (ENV, backendService, formDataObject) {
        return {
            restrict: 'AE',
            replace: true,
            scope: {
                elemData: '&elemData'
            },
            templateUrl: 'partials/scene-element-edit.html',
            controller: function ($scope, uiprops) {

                $scope.package = $scope.$parent.package;

                // For enum props config
                uiprops.then(function (props) {
                    $scope.props = props.data;
                });

                $scope.fileRoot = ENV.pkgRoot + $scope.package.appID + '/';

                /**
                 * 图片上传
                 */

                function uploadDataFormater(postArgs, attrs) {
                    postArgs.url = ENV.apiHost + 'uploadImage/';
                    postArgs.transformRequest = formDataObject;
                    postArgs.data = {
                        appid: $scope.package.appID,
                        fileName: attrs.current,
                        file: postArgs.data.files[0]
                    };
                    return postArgs;
                }

                $scope.imageViewUploadHandlers = {
                    before: uploadDataFormater,
                    after: function (info) {
                        $scope.elem.image = info.fileName;
                    },
                    onError: backendService.errLogger
                };

                $scope.deleteElement = function () {
                    $scope.$emit('delete-element', $scope.elem);
                };

                /**
                 * 文字样式
                 */


            },
            link: function (scope) {
                scope.elem = scope.elemData();
            }
        };
    });
