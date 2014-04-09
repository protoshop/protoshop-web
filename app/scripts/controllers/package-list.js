'use strict';

angular.module('toHELL')
.controller('PackageListCTRL', function ($scope, $http, $location, backendService, accountService, dialogShare) {

  if (!accountService.isLoggedIn()) {
    $location.path('/');
    return;
  }

  var currentUserEmail = accountService.getLoggedInUser().email;
  $scope.listOrder = function listOrder(pkg) {
    return pkg.appOwner === currentUserEmail
  };

  // 获取工程列表数据
  $scope.refreshList = function () {
    var user = accountService.getLoggedInUser();
    backendService.getProjectList(user, function (list) {
      $scope.packageList = list;
    });
  };

  // 列表初始化
  $scope.refreshList();

  /**
   * 开始编辑 Package
   */
  $scope.editPackage = function (pkg) {
    $location.path('/package/' + pkg.appID);
  };

  /**
   * 删除工程
   */
  $scope.deletePackage = function (pkg) {
    var opInfo = {
      appID: pkg.appID,
      token: accountService.getLoggedInUser().token
    };

    backendService.deleteProject(opInfo, function () {
      $scope.refreshList();
    });
  };

  /**
   * 分享按钮
   */
  $scope.sharePackage = function (pkg) {
    dialogShare.activate(pkg);
  };

  /**
   * 显示/隐藏『创建工程』对话框
   */
  $scope.toggleCreateDialog = function () {
    $scope.showCreateDialog = !$scope.showCreateDialog;
  };

  /**
   * 新建工程的默认配置
   */
  $scope.newPackageConfig = {
    appPlatform: 'ios',  // 'android' or 'ios'
    isPublicCheckbox: true,
    appOwner: accountService.getLoggedInUser().email,
    appName: '',
    appDesc: ''
  };

  /**
   * 创建工程
   */
  $scope.createProject = function () {

    // 转换 checkbox 的值（true 或 false）为数据需要的字符串格式（'1'或'0'）
    $scope.newPackageConfig.isPublic = $scope.newPackageConfig.isPublicCheckbox ? '1' : '0';

    // 附上 token
    $scope.newPackageConfig.token = accountService.getLoggedInUser().token;

    var postData = {
      context: $scope.newPackageConfig
    };

    backendService.createProject(postData, function (result) {
      $location.path('/package/' + result[0].appID);
    });

  };

});