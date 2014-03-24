'use strict';

angular.module('toHELL')
.controller('PackageEditCTRL', [
  '$scope',
  '$routeParams',
  '$http',
  '$document',
  'formDataObject',
  'GLOBAL',
  '$location',
  'editService',
  '$timeout',
  'notifyService',
  'loginService',
  function ($scope, $routeParams, $http, $document, formDataObject, GLOBAL, $location, editService, $timeout,
  notifyService, loginService) {

    var token;
    if (!loginService.isLoggedIn()) {
      $location.path('/');
      return;
    } else {
      token = loginService.getLoggedInUser().token;
    }

    $scope.fileRoot = GLOBAL.pkgHost + '/' + $routeParams.pkgId + '/';

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
    // $http.get('/api/package/' + $routeParams.pkgId + '.json')
    // $http.get('/api/package/' + '1d9abf59bfade93c71fbb260b6dc7390.json')
    $http.get(GLOBAL.apiHost + 'fetchProject/?appid=' + $routeParams.pkgId + '&token=' + token)
    .success(function (data) {
      $scope.package = data;
      editService.setPackage($scope.package);
      editService.setStat($scope.editStat);
      // 默认选中第一个场景
      var sceneId = editService.findScene('order', 0);
      $scope.selectScene(sceneId);
    })
    .error(GLOBAL.errLogger);

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
      args.url = GLOBAL.apiHost + 'uploadImage/';
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
      onError: GLOBAL.errLogger
    };

    $scope.sceneBgUploadHandlers = {
      before: uploadDataFormater,
      after: function (data) {
        if (data.status === '1') {
          $scope.editStat.selectedScene.background = $scope.fileRoot + data.fileName;
        }
      },
      onError: GLOBAL.errLogger
    };

    /**
     * 保存编辑好的项目JSON数据
     */

    $scope.$on('package.save', function () {
      $scope.package.token = token;
      $http.post(GLOBAL.apiHost + 'saveProject/', {
        context: $scope.package
      })
      .success(function (res) {
        switch (res.status) {
        case '1':
          notifyService.notify('已保存！');
          break;
        default:
          var errDesc = GLOBAL.errDesc[res.error_code] || '未知错误';
          notifyService.warn('Error: ' + errDesc);
        }
      })
      .error(GLOBAL.errLogger);
    });

    /**
     * 响应键盘动作
     */

    $scope.$on('keydown', function (onEvent, keyEvent) {
      switch (keyEvent.which) {
      case 8:
        // 阻止 Backspace 后退
        keyEvent.preventDefault();
      }
    });

  }
]);
