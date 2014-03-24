'use strict';

angular.module('toHELL')
.directive('uploader', ['$http', 'GLOBAL', 'formDataObject', function ($http, GLOBAL) {
  return {
    restrict: 'A',
    link: function (scope, el, attrs) {

      // 当 input 内容发生改变时直接上传
      el.bind('change', function (ev) {

        // handlers 对象包含两个方法：可选 before(postArgs), 必选 after(response)
        var handlers = scope[attrs.handlers];

        if (handlers) {

          // 创建 POST 参数对象
          var postArgs = {
            method: 'POST',
            url: attrs.url || '',
            headers: {
              'Content-Type': 'multipart/form-data'
            },
            data: {
              files: ev.target.files
            }
          };

          // handlers.before() 应该返回经过整理的 postArgs.
          if (handlers.before) {
            postArgs = handlers.before(postArgs);
          }

          // 发起上传请求
          $http(postArgs)
          .success(handlers.after)
          .error(GLOBAL.errLogger);
        }

      });
    }
  };
}]);
