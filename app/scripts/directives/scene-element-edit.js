'use strict';

angular.module('toHELL')

/**
 * Element Editor in scene editor
 */

.directive('elementEdit', function (backendService, formDataObject) {
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

      /**
       * 图片上传
       */
      
      $scope.fileRoot = backendService.pkgDir + $scope.package.appID + '/';

      function uploadDataFormater(postArgs, attrs) {
        postArgs.url = backendService.apiHost + 'uploadImage/';
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

    },
    link: function (scope) {
      scope.elem = scope.elemData();
    }
  };
});
