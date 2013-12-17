'use strict';

(function () {
  var module = angular.module('toHELL');

  module.factory('notifyService', [function () {
    function NotifyServiceInstance () {
      /**
       * 表示一个通知项
       * @typedef {Object} NotifyItem
       * @property {string} nType - 通知项所属的类别。目前只能是info、warn、error三者之一。
       * @property {string} content - 通知项内容。
       */
      this.items = [];
      // this.items = [
      //   {
      //     nType: "info",
      //     content: "abcd"
      //   },{
      //     nType: "warn",
      //     content: "abcde"
      //   }
      // ];
      this.last = null; // 总是指向最后增加的NotifyItem，方便链式调用，如：NotifyService.notify().xxx()

      this.notify = function (c) {
        var newNotify = {
          nType: 'info',
          content: c
        };
        this.items.push(newNotify);
        this.last = newNotify;
        return this;
      };

      this.warn = function (c) {
        var newNotify = {
          nType: 'warn',
          content: c
        };
        this.items.push(newNotify);
        this.last = newNotify;
        return this;
      };

      this.error = function (c) {
        var newNotify = {
          nType: 'error',
          content: c
        };
        this.items.push(newNotify);
        this.last = newNotify;
        return this;
      };

      this.remove = function (ele) {
        if (ele) {
          this.items.splice(this.items.indexOf(ele), 1);
          this.last = null;
        } else {
          this.items.splice(this.items.indexOf(this.last), 1);
          this.last = null;
        }
      };
    }

    return new NotifyServiceInstance();
  }]);
})();
