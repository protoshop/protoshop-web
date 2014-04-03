'use strict';

angular.module('toHELL')
.controller('PackageEditCTRL', function ($scope, $routeParams, $document, formDataObject, $location, backendService,
editService, $timeout, notifyService, accountService) {

  if (!accountService.isLoggedIn()) {
    $location.path('/');
    return;
  }

  $scope.fileRoot = backendService.pkgHost + '/' + $routeParams.pkgId + '/';

  /**
   * 存储当前的编辑状态
   * @var {Object}
   */

  $scope.editStat = {
    selectedScene: null,
    selectedElement: null,
    selectedAction: null,
    gotoSignStyle: {
      top: '',
      right: ''
    },
    gotoLineStyle: {
      width: '264px'
    },
    sceneHasAdded: false // 表示场景列表中是否有后添加的场景。这个变量与新增场景自动聚焦相关。
  };

  /**
   * 获取工程数据，本地存储为 $scope.package
   */

  $scope.package = {};

  backendService.getPackage({
    pkgId: $routeParams.pkgId,
    token: accountService.getLoggedInUser().token
  }, function (result) {
    $scope.package = JSON.parse(result[0]);
    editService.setPackage($scope.package);
    editService.setStat($scope.editStat);
    // 默认选中第一个场景
    var sceneId = editService.findScene('order', 0);
    $scope.selectScene(sceneId);
  });

  editService.setStat($scope.editStat);

  for (var attr in editService) {
    if (editService.hasOwnProperty(attr)) {
      $scope[attr] = editService[attr];
    }
  }

  /**
   * 编辑区空白区域点击时调用此函数，用以清除已选元素、动作
   */

  $scope.onBackgroundClick = function () {
    editService.deselectElement();
  };

  $scope.onActorItemClick = function (element) {
    editService.selectElement(element);
  };

  function uploadDataFormater(args) {
    args.url = backendService.apiHost + 'uploadImage/';
    args.transformRequest = formDataObject;
    args.data = {
      appid: $scope.package.appID,
      file: args.data.files[0]
    };
    return args;
  }

  $scope.iconUploadHandlers = {
    before: uploadDataFormater,
    after: function (data) {
      if (data.status === '1') {
        $scope.package.icon = data.fileName;
      }
    },
    onError: backendService.errLogger
  };

  $scope.sceneBgUploadHandlers = {
    before: uploadDataFormater,
    after: function (data) {
      if (data.status === '1') {
        $scope.editStat.selectedScene.background = $scope.fileRoot + data.fileName;
      }
    },
    onError: backendService.errLogger
  };

  /**
   * 保存编辑好的项目JSON数据
   */

  $scope.$on('package.save', function () {

    $scope.package.token = accountService.getLoggedInUser().token;
    backendService.savePackage($scope.package, function () {
      notifyService.notify('已保存！');
    });

  });

  /**
   * 响应键盘动作
   */

  $scope.$on('keydown', function (onEvent, keyEvent) {
    switch (keyEvent.which) {
    case 8:
      // 酌情阻止 Backspace 后退
      if ($scope.editStat.selectedElement) {
        // 如果有选中 element
        editService.removeElement($scope.editStat.selectedElement);
        keyEvent.preventDefault();
        keyEvent.stopPropagation();
        $scope.$apply();
      } else if (keyEvent.target.tagName == 'INPUT') {
        // 如果焦点在输入框内，则阻止冒泡
        keyEvent.stopPropagation();
      } else if (!confirm('确认：返回工程列表？\n未保存的修改将会丢失')) {
        keyEvent.preventDefault();
        keyEvent.stopPropagation();
      }
    }
  });

});
