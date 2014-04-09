'use strict';

angular.module('toHELL')

/**
 * 加载指示器
 */

.factory('loadingIndicator', function () {

  var html = '<div class="spinner"></div>';
  var begin;

  return function (show, info) {
    var api = info ? info.replace(/^.*ProtoShop/, '') : '';
    if (show) {
      begin = new Date;
      api ? console.time(api) : (1);
//      console.log('[Request]', api);
      angular.element(document.body).append(html);
    } else {
      api ? console.timeEnd(api) : (1);
//      console.log('[RequestTime]', (new Date - begin) / 1000, api);
      angular.element('body > .spinner').remove();
    }
  };
})

/**
 * 集中后端服务
 */

.factory('backendService', function ($http, notifyService, loadingIndicator) {

  var isBeta = /(beta|:9999)/.test(window.location.href);

  function errLogger(res, infoPrefix) {
    var errInfo = '[ERR:' + res.code + '] ' + res.message;
    console.log(infoPrefix || 'Backend Service Error: ', errInfo, res);
    notifyService.error(res.message);
  }

  function httpErrLogger(err) {
    loadingIndicator(false);
    console.log(err);
  }

  /**
   * HTTP 请求集散中心
   * @param {Object=} data
   * @param {String} url
   * @param {Function=} callback
   * @param {Function=} errCallback
   */
  function makeRequest(data, url, callback, errCallback) {
    loadingIndicator(true, url);

    if (data) {
      // Make 'POST'
      $http.post(url, data)
      .success(function (res) {
        loadingIndicator(false, url);
        if (res.status === 0) {
          callback && callback(res.result)
        } else {
          notifyService.error(res.message);
          errCallback && errCallback(res);
        }
      })
      .error(httpErrLogger);
    } else {
      // Make 'GET'
      $http.get(url)
      .success(function (res) {
        loadingIndicator(false, url);
        if (res.status === 0) {
          callback && callback(res.result)
        } else {
          notifyService.error(res.message);
          errCallback && errCallback(res);
        }
      })
      .error(httpErrLogger);
    }
  }

  return {
    apiHost: isBeta
    ? 'http://protoshop.ctripqa.com/ProtoShop/'
    : 'http://protoshop.ctripqa.com/ProtoShop/',
    pkgDir: isBeta
    ? 'http://protoshop.ctripqa.com/packages/'
    : 'http://protoshop.ctripqa.com/packages/',
    errLogger: errLogger,

    /**
     * 获取工程列表
     */
    getProjectList: function (info, callback) {
      var url = this.apiHost + 'fetchlist/?device=&token=' + info.token;
      makeRequest(undefined, url, callback);
    },

    /**
     * 创建工程
     */
    createProject: function (data, callback) {
      var url = this.apiHost + 'createPoject/';
      makeRequest(data, url, callback);
    },

    /**
     * 删除工程
     */
    deleteProject: function (info, callback) {
      var url = this.apiHost + 'deleteProject/?appid=' + info.appID + '&token=' + info.token;
      makeRequest(undefined, url, callback);
    },

    /**
     * 获取指定工程的分享列表
     */
    getProjectSharer: function (data, callback) {
      var url = this.apiHost + 'shareList/';
      makeRequest(data, url, callback);
    },

    /**
     * 搜索用户
     */
    searchUser: function (data, callback) {
      var url = this.apiHost + 'searchUser/';
      makeRequest(data, url, callback);
    },

    /**
     * 设置工程对某用户的分享状态
     */
    setShare: function (args, callback) {
      var url = this.apiHost + 'share/';
      makeRequest(args, url, callback);
    },

    /**
     * 获取工程包数据
     */
    getPackage: function (info, callback) {
      var url = this.apiHost + 'fetchProject/?appid=' + info.pkgId + '&token=' + info.token;
      // var url = '/api/package/' + info.pkgId + '.json'
      // var url = '/api/package/' + '1d9abf59bfade93c71fbb260b6dc7390.json'
      makeRequest(undefined, url, callback);
    },

    /**
     * 保存工程包数据
     */
    savePackage: function (data, callback) {
      var url = this.apiHost + 'saveProject/';
      makeRequest({
        context: data
      }, url, callback);
    }

  }
});
