'use strict';

angular.module('toHELL')
  .controller('PackageEditCTRL', ['$scope', '$routeParams', '$http', '$document', 'formDataObject', 'GLOBAL',
    '$location', 'editService', '$timeout', 'notifyService', 'loginService',
    function ($scope, $routeParams, $http, $document, formDataObject, GLOBAL, $location, editService, $timeout,
      notifyService, loginService) {

      if (!loginService.isLoggedIn()) {
        $location.path('/');
        return;
      }

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

      $scope.package = {};
      /**
       * 存储整个工程的实时状态
       * @var {Object} $scope.package
       */
        // $http.get('/api/package/' + $routeParams.pkgId + '.json')
        // $http.get('/api/package/' + '1d9abf59bfade93c71fbb260b6dc7390.json')
      $http.get(GLOBAL.apiHost + 'fetchProject/?appid=' + $routeParams.pkgId)
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
       * @func onBackgroundClick
       * @private
       */
      $scope.onBackgroundClick = function () {
        editService.deselectElement();
      };

      $scope.onActorItemClick = function (element) {
        editService.selectElement(element);
      };

      $scope.fileChange = function (files) {
        $http({
          method: 'POST',
          url: GLOBAL.apiHost + 'uploadImage/',
          headers: {
            'Content-Type': 'multipart/form-data'
          },
          transformRequest: formDataObject,
          data: {
            appid: $scope.package.appID,
            file: files[0]
          }
        }).success(function (data) {
            var pkgURI = GLOBAL.pkgHost + $scope.package.appID + '/';
            $scope.editStat.selectedScene.background = pkgURI + data.fileName;
            console.log('suc: ', data);
          })
          .error(function (err) {
            console.log('err: ', err);
          });
      };

      /**
       * 保存编辑好的项目JSON数据
       */
      $scope.savePackage = function () {
        $http.post(GLOBAL.apiHost + 'saveProject/', {
          context: $scope.package
        })
          .success(function () {
            // window.alert('已保存！');
            notifyService.notify('已保存！');
            console.log('Package "' + $scope.package.appID + '" saved!');
          });
      };

    }]);
