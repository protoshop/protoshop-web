'use strict';

angular.module('toHELL')
  .controller('PackageEditCTRL', ['$scope', '$routeParams', '$http', '$document', 'formDataObject',
    'GLOBAL', 'editService', '$timeout', 'notifyService',
    function ($scope, $routeParams, $http, $document, formDataObject, GLOBAL, 
      editService, $timeout, notifyService) {
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
          var sceneId = editService.findScene('order', '0');
          $scope.selectScene(sceneId);
        })
        .error(GLOBAL.errLogger);

      editService.setStat($scope.editStat);

      for(var attr in editService) {
        $scope[attr] = editService[attr];
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

      $scope.openUploaderWindow = function () {
        window.uploadSuccess = function (imageName) {
          var imgSrc = GLOBAL.host + 'packages/' + $routeParams.pkgId + '/' + imageName + '.png';
          $scope.editStat.selectedScene.background = imgSrc;
        };
        var x = screen.width / 2 - 700 / 2;
        var y = screen.height / 2 - 450 / 2;
        window.open(
//          '/api/uploader/#' + $routeParams.pkgId, //test
//          '/api/uploader/success.html#aaa' + $routeParams.pkgId, //test
          GLOBAL.host + 'api/uploader/#' + $routeParams.pkgId,
          'DescriptiveWindowName',
          'width=420,height=230,resizable,scrollbars=no,status=1,left=' + x + ',top=' + y
        );
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
        })
          .success(function (data) {
            console.log('suc: ', data);
          })
          .error(function (err) {
            console.log('err: ', err)
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
