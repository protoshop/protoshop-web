'use strict';

angular.module('toHELL')
.directive('uploader', function ($http, ENV, notifyService) {
  return {
    restrict: 'A',
    link: function (scope, el, attrs) {

      // 当 input 内容发生改变时直接上传
      el.bind('change', function (ev) {

        // handlers 对象包含三个方法：
        //   - (可选) before(postArgs),
        //   - (必选) after(response),
        //   - (可选) onError(error)
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
            postArgs = handlers.before(postArgs, attrs);
          }

          // 发起上传请求
          $http(postArgs, ENV.apiHost + '/uploadImage/')
          .success(function (res) {
            if (res.status === 0) {
              handlers.after(res.result[0]);
            } else {
              notifyService.error(res.message);
            }
          })
          .error(handlers.onError || angular.noop);
        }

      });
    }
  };
});
