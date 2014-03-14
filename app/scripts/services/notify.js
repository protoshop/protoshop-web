'use strict';

angular.module('toHELL')
.factory('notifyService', ['$timeout', function ($timeout) {

  var items = [];

  /**
   * 创建一个通知项
   * @param {String} message 消息内容
   * @param {String=} type 消息类型
   * @param {Number=} timeout
   */

  function create(message, type, timeout) {

    type = type || 'info';
    timeout = timeout || 30000;

    // 新的通知项目
    items.push({
      type: type,
      message: message
    });

    // 定时自动消失
    $timeout(function () {
      items.shift();
    }, timeout);

    return notifyService;
  }

  var notifyService = {
    getItems: function () {
      return items;
    },
    notify: function (msg) {
      return create(msg, 'info');
    },
    warn: function (msg) {
      return create(msg, 'warning');
    },
    error: function (msg) {
      return create(msg, 'error');
    }
  };

  return notifyService;

}]);
