'use strict';

angular.module('toHELL')
  .controller('PackageListCTRL', ['$scope', '$http', '$location', 'Global', function ($scope, $http, $location, Global) {

    // To get data & set list.
    $scope.refreshList = function () {
      $http.get(Global.apiHost + 'fetchlist')
//      $http.get('/api/package/list.json')
        .success(function (data) {
          $scope.packageList = data.projectList;
        })
        .error(function (data, status, headers, config) {
          alert('Error: ' + status + '\n' + data);
          console.log(data, status, config);
        });
    };

    // Init list
    $scope.refreshList();

    /**
     * Package 编辑
     * @param pkg
     */
    $scope.editPackage = function (pkg) {
      $location.path('/package/' + pkg.appID);
    };

    /**
     * Package 删除
     * @param pkg
     */
    $scope.deletePackage = function (pkg) {
      $http.delete(Global.apiHost + 'package/' + pkg.appID)
        .success(function () {
          $scope.refreshList();
        });
    };

    /**
     * 显示/隐藏『创建Package』对话框
     */
    $scope.toggleCreateDialog = function () {
      $scope.showCreateDialog = !$scope.showCreateDialog;
    };

    /**
     * 创建 Package 的默认配置
     * @type {{appName: string, comment: string}}
     */
    $scope.newPackageConfig = {
      appName: '',
      comment: ''
    };

    /**
     * 创建 Package
     */
    $scope.createPackage = function () {
      var postData = {
        context: $scope.newPackageConfig
      };
      $http.post(Global.apiHost + 'createPoject/', postData)
        .success(function (data) {
          $location.path('/package/' + data.appID);
        });
    };
  }]);