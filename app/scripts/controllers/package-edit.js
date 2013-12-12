'use strict';

angular.module('toHELL')
  .controller('PackageEditCTRL', ['$scope', '$routeParams', '$http', '$document', 'GLOBAL', 'sceneService',
    'elementService', 'actionService', 'packageService', '$timeout',
    function ($scope, $routeParams, $http, $document, GLOBAL, sceneService, elementService, actionService,
      packageService, $timeout) {
      /**
       * 存储当前的编辑状态
       * @var {Object}
       */
      $scope.editStat = {
        selectedScene  : null,
        selectedElement: null,
        selectedAction : null,
        gotoSignStyle  : {
          top  : '',
          right: ''
        },
        gotoLineStyle  : {
          width: '264px'
        }
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
          packageService.setPackage($scope.package);
          packageService.setStat($scope.editStat);
        })
        .error(GLOBAL.errLogger);

      packageService.setStat($scope.editStat);

      $scope.addScene = function () {
        var newOne = sceneService.addScene();
        elementService.deselectElement();
        actionService.deselectAction();
        sceneService.selectScene(newOne);
        // NOTE: 由于angular的HTML刷新是在整个函数运行结束之后，这里需要用异步的方式来延后得到新增的HTML
        $timeout(function () {
          triggerSceneNameEditor(newOne);
        }, 0);
      };
      $scope.removeScene = function (scene) {
        elementService.deselectElement();
        actionService.deselectAction();
        sceneService.removeScene(scene);
      };

      $scope.selectAction = function (action) {
        return actionService.selectAction(action);
      };
      $scope.deselectAction = function () {
        actionService.deselectAction();
      };
      $scope.addAction = function () {
        actionService.addAction();
      };
      $scope.removeAction = function (action) {
        actionService.removeAction(action);
      };
      $scope.resizeHotspotTo = function (ele, w, h) {
        actionService.resizeHotspotTo(ele, w, h);
      };
      $scope.renderActionItem = function (action) {
        return actionService.renderActionItem(action);
      };

      $scope.addHotspotElement = function () {
        elementService.addHotspotElement();
        actionService.deselectAction();
      };

      // $scope.selectElement = function(ele) {
      //   elementService.selectElement(ele);
      // };

      $scope.removeElement = function (ele) {
        elementService.removeElement(ele);
      };

      /**
       * 选中一个场景
       * @func selectScene
       * @param {Object} scene - 被选中的场景
       */
      $scope.selectScene = function (scene) {
        sceneService.selectScene(scene);
        // 清除掉之前可能有的其他元素、动作选择
        elementService.deselectElement();
        actionService.deselectAction();
      };

      $scope.defaults = {
        sceneBackground: 'images/dummy-scene-thumb.png'
      };

      /**
       * 释放选中的场景。连带释放选中的元素。
       * @func deselectScene
       */
      $scope.deselectScene = function () {
        sceneService.deselectScene();
        elementService.deselectElement();
        actionService.deselectAction();
      };

      /**
       * 编辑区空白区域点击时调用此函数，用以清除已选元素、动作
       * @func onBackgroundClick
       * @private
       */
      $scope.onBackgroundClick = function () {
        elementService.deselectElement();
      };

      $scope.onActorItemClick = function (element) {
        elementService.selectElement(element);
      };

      $scope.openUploaderWindow = function () {
        window.uploadSuccess = function (imageName) {
          var imgSrc = GLOBAL.host + 'packages/' + $routeParams.pkgId + '/' + imageName + '.png';
          $scope.editStat.selectedScene.background = imgSrc;
        };
        var x = screen.width / 2 - 700 / 2;
        var y = screen.height / 2 - 450 / 2;
        window.open(
          // '/api/uploader/#' + $routeParams.pkgId, //test
          // '/api/uploader/success.html#aaa' + $routeParams.pkgId, //test
          GLOBAL.host + 'api/uploader/#' + $routeParams.pkgId,
          'DescriptiveWindowName',
          'width=420,height=230,resizable,scrollbars=no,status=1,left=' + x + ',top=' + y
        );
      };

      // WARN: 注意，这里和UI结合的过于紧密，在UI的改造中极易失效
      function triggerSceneNameEditor(scene) {
        if (!(scene && scene.id)) {
          return;
        }

        var jq = angular.element;
        var item = jq('.scene-item[data-scene-id="' + scene.id + '"] input');
        item.focus();
      }

      /**
       * 保存编辑好的项目JSON数据
       */
      $scope.savePackage = function () {
        $http.post(GLOBAL.apiHost + 'saveProject/', {
          context: $scope.package
        })
          .success(function () {
            window.alert('已保存！');
            console.log('Package "' + $scope.package.appID + '" saved!');
          });
      };

    }]);
