'use strict';

angular.module('toHELL')

/**
 * 加载指示器
 */

    .factory('loadingIndicator', function () {

        var html = '<div class="spinner"></div>';

        return function (show, info) {
            var api = info ? info.replace(/^.*ProtoShop(\/\w+\/).*/, '$1') : '';
            if (show) {
                api && console.time(api);
                angular.element(document.body).append(html);
            } else {
                api && console.timeEnd(api);
                angular.element('body > .spinner').remove();
            }
        };
    })

/**
 * 集中后端服务
 */

    .factory('backendService', function ($http, ENV, notifyService, loadingIndicator, accountService) {

        var token = accountService.getLoggedInUser().token;

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
                            callback && callback(res.result);
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
                            callback && callback(res.result);
                        } else {
                            notifyService.error(res.message);
                            errCallback && errCallback(res);
                        }
                    })
                    .error(httpErrLogger);
            }
        }

        return {
            errLogger: errLogger,

            /**
             * 获取工程列表
             */
            getProjectList: function (info, callback) {
                var url = ENV.apiHost + 'fetchlist/?device=&token=' + info.token;
                makeRequest(undefined, url, callback);
            },

            /**
             * 创建工程
             */
            createProject: function (data, callback) {
                var url = ENV.apiHost + 'createPoject/';
                makeRequest(data, url, callback);
            },

            /**
             * 删除工程
             */
            deleteProject: function (info, callback) {
                var url = ENV.apiHost + 'deleteProject/?appid=' + info.appID + '&token=' + info.token;
                makeRequest(undefined, url, callback);
            },

            /**
             * 获取指定工程的分享列表
             */
            getProjectSharer: function (data, callback) {
                var url = ENV.apiHost + 'shareList/';
                makeRequest(data, url, callback);
            },

            /**
             * 搜索用户
             */
            searchUser: function (data, callback) {
                var url = ENV.apiHost + 'searchUser/';
                makeRequest(data, url, callback);
            },

            /**
             * 设置工程对某用户的分享状态
             */
            setShare: function (args, callback) {
                var url = ENV.apiHost + 'share/';
                makeRequest(args, url, callback);
            },

            /**
             * 获取工程包数据
             */
            getPackage: function (info, callback) {
                var url = ENV.apiHost + 'fetchProject/?appid=' + info.pkgId + '&token=' + info.token;
                // var url = '/api/package/' + info.pkgId + '.json'
                // var url = '/api/package/' + '1d9abf59bfade93c71fbb260b6dc7390.json'
                makeRequest(undefined, url, callback);
            },

            /**
             * 保存工程包数据
             */
            savePackage: function (data, callback) {
                var url = ENV.apiHost + 'saveProject/';
                makeRequest({
                    context: {
                        token: accountService.getLoggedInUser().token
                    },
                    package: data
                }, url, callback);
            }

        };
    });
