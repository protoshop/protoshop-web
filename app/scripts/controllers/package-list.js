'use strict';

angular.module('toHELL')
.controller('PackageListCTRL', function ($scope, $http, $location, backendService, loginService, dialogShare) {

  var token;
  if (!loginService.isLoggedIn()) {
    $location.path('/');
    return;
  } else {
    token = loginService.getLoggedInUser().token;
  }

  // Get project list data & set data.
  $scope.refreshList = function () {
    backendService.getProjectList(function (list) {
      $scope.packageList = list;
    });
  };

  // Init list
  $scope.refreshList();

  /**
   * 开始编辑 Package
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
    $http.get(GLOBAL.apiHost + 'deleteProject/?appid=' + pkg.appID + '&token=' + token)
    .success(function (res) {
      switch (res.status) {
      case '1':
        $scope.refreshList();
        break;
      default:
        var errDesc = GLOBAL.errDesc[res.error_code] || '未知错误';
        console.log('Delete Project Error: ', errDesc, res);
      }

    });
  };

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
   * @type {{appName: string, comment: string}}
   */
  $scope.newPackageConfig = {
    appPlatform: 'ios',  // 'android' or 'ios'
    isPublicCheckbox: true,
    appOwner: loginService.getLoggedInUser().email,
    appName: '',
    appDesc: ''
  };

  /**
   * 创建工程
   */
  $scope.createPackage = function () {

    // 转换 checkbox 的值（true 或 false）为数据需要的字符串格式（'1'或'0'）
    $scope.newPackageConfig.isPublic = $scope.newPackageConfig.isPublicCheckbox ? '1' : '0';

    // 附上 token
    $scope.newPackageConfig.token = token;

    var postData = {
      context: $scope.newPackageConfig
    };

    $http.post(GLOBAL.apiHost + 'createPoject/', postData)
    .success(function (res) {

//            此接口暂无 status 标志位
//            switch (res.status) {
//            case '1':
//              $location.path('/package/' + data.appID);
//              break;
//            default:
//              var errDesc = GLOBAL.errDesc[res.error_code] || '未知错误';
//              console.log('Delete Project Error: ', errDesc, res);
//            }

      $location.path('/package/' + res.appID);
    })
    .error(GLOBAL.errLogger);
  };

});