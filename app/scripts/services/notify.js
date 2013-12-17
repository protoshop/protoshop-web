'use strict';

(function () {
  var module = angular.module('toHELL');

  module.factory('notifyService', ['$timeout', function ($timeout) {
    function NotifyServiceInstance () {
      var self = this;
      /**
       * 表示一个通知项
       * @typedef {Object} NotifyItem
       * @property {string} nType - 通知项所属的类别。目前只能是info、warn、error三者之一。
       * @property {string} content - 通知项内容。
       */
      self.items = [];
      // this.items = [
      //   {
      //     nType: "info",
      //     content: "abcd"
      //   },{
      //     nType: "warn",
      //     content: "abcde"
      //   }
      // ];
      self.last = null; // 总是指向最后增加的NotifyItem，方便链式调用，如：NotifyService.notify().xxx()

      self.notify = function (c) {
        var newNotify = {
          nType: 'info',
          content: c
        };
        self.items.push(newNotify);
        self.last = newNotify;
        $timeout(function() {
          self.remove(newNotify);
        }, 2000);
        return self;
      };

      self.warn = function (c) {
        var newNotify = {
          nType: 'warn',
          content: c
        };
        self.items.push(newNotify);
        self.last = newNotify;
        // 警告应当比普通的通知有更多时间，给用户充足时间阅读
        $timeout(function() {
          self.remove(newNotify);
        }, 4000); 
        return self;
      };

      self.error = function (c) {
        var newNotify = {
          nType: 'error',
          content: c
        };
        self.items.push(newNotify);
        self.last = newNotify;
        // 错误不应该自动消失
        return self;
      };

      self.remove = function (ele) {
        if (ele) {
          self.items.splice(self.items.indexOf(ele), 1);
          self.last = null;
        } else {
          self.items.splice(self.items.indexOf(self.last), 1);
          self.last = null;
        }
      };
    }

    return new NotifyServiceInstance();
  }]);
})();
