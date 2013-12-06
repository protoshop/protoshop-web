'use strict';

angular.module('toHELL')
  .controller('PackageEditCTRL', ['$scope', '$routeParams', '$http', '$document',
    'GLOBAL', 'sceneService', 'elementService', 'actionService',
    function ($scope, $routeParams, $http, $document, GLOBAL, sceneService, elementService, actionService) {
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
        /**
         * 移动hotspot时的临时存储栈
         * @var hotspotStack
         * @private
         */
        hotspotStack: {
          hotspotMovingTarget: null,
          hotspotDom: null,
          hotspotMovingStart: {
            x: 0,
            y: 0
          },
          hotspotMovingOffset: {
            x: 0,
            y: 0
          },
          hotspotOldZindex: null
        },
        expanderStack: {
          expanderMovingTarget: null,
          expanderMovingStart: {
            x: 0,
            y: 0
          },
          expanderMovingOffset: {
            x: 0,
            y: 0
          },
          hotspotPos: {
            x: 0,
            y: 0
          },
          hotspot: {
            width: 0,
            height: 0
          },
          expanderIndex: null
        }
      };

      $scope.package = {};
      /**
       * 存储整个工程的实时状态
       * @var {Object} $scope.package
       */
     // $http.get('/api/package/' + $routeParams.pkgId + '.json')
     $http.get('/api/package/' + '1d9abf59bfade93c71fbb260b6dc7390.json')
      // $http.get(GLOBAL.apiHost + 'fetchProject/?appid=' + $routeParams.pkgId)
        .success(function (data) {
          $scope.package = data;
          sceneService.setPackage($scope.package);
          elementService.setPackage($scope.package);
          actionService.setPackage($scope.package);
        })
        .error(GLOBAL.errLogger);

      sceneService.setStat($scope.editStat);
      elementService.setStat($scope.editStat);
      actionService.setStat($scope.editStat);

      $scope.addScene = function() {
        sceneService.addScene();
        elementService.deselectScene();
        actionService.deselectAction();
      };
      $scope.removeScene = function() {
        sceneService.removeScene();
        elementService.deselectScene();
        actionService.deselectAction();
      };

      $scope.selectAction = actionService.selectAction.bind(actionService);
      $scope.deselectAction = actionService.deselectAction.bind(actionService);
      $scope.addAction = actionService.addAction.bind(actionService);
      $scope.resizeHotspotTo = actionService.resizeHotspotTo.bind(actionService);
      $scope.renderActionItem = actionService.renderActionItem.bind(actionService);

      $scope.addHotspotElement = function() {
        elementService.addHotspotElement();
        actionService.deselectAction();
      };

      /**
       * 选中一个场景
       * @func selectScene
       * @param {Scene} scene - 被选中的场景
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

      /**
       * 保存编辑好的项目JSON数据
       */
      $scope.savePackage = function () {
        $http.post(GLOBAL.apiHost + 'saveProject/', {
          context: $scope.package
        })
          .success(function () {
            console.log('Package "' + $scope.package.appID + '" saved!');
          });
      };

    }]);
