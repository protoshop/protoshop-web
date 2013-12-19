'use strict';

(function () {
  var module = angular.module('toHELL');

  module.factory('notifyService', ['$timeout', function ($timeout) {
    function NotifyServiceInstance() {
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

      /**
       * 新增一个消息通知项
       * @func notify
       * @param {NotifyItem} c - 输出文本
       */
      self.notify = function (c) {
        var newNotify = {
          nType: 'info',
          content: c
        };
        self.items.push(newNotify);
        self.last = newNotify;
        $timeout(function () {
          self.remove(newNotify);
        }, 2000);
        return self;
      };

      /**
       * 新增一个警告通知项
       * @func warn
       * @param {NotifyItem} c - 输出文本
       */
      self.warn = function (c) {
        var newNotify = {
          nType: 'warn',
          content: c
        };
        self.items.push(newNotify);
        self.last = newNotify;
        // 警告应当比普通的通知有更多时间，给用户充足时间阅读
        $timeout(function () {
          self.remove(newNotify);
        }, 4000);
        return self;
      };

      /**
       * 新增一个错误通知项
       * @func error
       * @param {NotifyItem} c - 输出文本
       */
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

      /**
       * 删除一个通知项。如果给出参数则删除该通知项，否则删除最后增加的通知项。
       * @func error
       * @param {NotifyItem|undefined} ele - 需要删除的通知项。如果不提供则删除最后增加的通知项。
       */
      self.remove = function (ele) {
        if (ele) {
          self.items.splice(self.items.indexOf(ele), 1);
          self.last = null;
        } else {
          if (self.last) {
            self.items.splice(self.items.indexOf(self.last), 1);
          }
          self.last = null;
        }
      };
    }

    return new NotifyServiceInstance();
  }]);
})();
