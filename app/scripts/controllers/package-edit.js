'use strict';

angular.module('toHELL')
    .controller('PackageEditCTRL', function ($rootScope,$scope, $routeParams, $document,  ENV, formDataObject, $location,
                                             backendService, editService, $timeout, notifyService, accountService) {
        if (!accountService.isLoggedIn()) {
            $location.path('/');
            return;
        }

        $scope.fileRoot = ENV.pkgRoot + $routeParams.pkgId + '/';

        /**
         * 存储当前的编辑状态
         * @var {Object}
         */

        $scope.editStat = {
            selectedScene: null,
            selectedElement: null,
            selectedAction: null,
            selectChildElement : null,
            comments : null,
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
            var data = result[0], scenes = data.scenes, firstScenes=scenes;

            // 默认选中第一个场景,优先渲染
            $scope.selectScene(scenes[0]);

            if (scenes.length > 5){
                firstScenes = scenes.slice(0,5);
            }


            // 暂时初始化package
            $scope.package = {
                appID: data.appID,
                appIcon: data.appIcon,
                appName: data.appName,
                appPlatform: data.appPlatform,
                scenes : firstScenes,
                size : data.size,
                splash : data.splash
            };

            $scope.size = $scope.package.appPlatform === 'ios' ? {
                width: 320,
                height: 568
            } : {
                width: 400,
                height: 640
            };

            // 延时渲染左侧例表
            if (scenes.length > 5){
                $timeout(function(){
                    $scope.package.scenes.push.apply($scope.package.scenes, scenes.slice(5));
                    editService.setPackage($scope.package);
                    // 默认选中第一个场景
                    //var sceneId = editService.findScene('order', 0);
                    //$scope.selectScene(sceneId);
                    editService.setStat($scope.editStat);
                    $scope.$apply();
                },500);
            }
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

        /**
         * 图标上传和背景图上传
         */

        function uploadDataFormater(postArgs, attrs) {
            postArgs.url = ENV.apiHost + 'uploadImage/';
            postArgs.transformRequest = formDataObject;
            postArgs.data = {
                appid: $scope.package.appID,
                fileName: attrs.current,
                file: postArgs.data.files[0]
            };
            return postArgs;
        }

        $scope.iconUploadHandlers = {
            before: uploadDataFormater,
            after: function (info) {
                $scope.package.icon = info.fileName;
            },
            onError: backendService.errLogger
        };

        $scope.sceneBgUploadHandlers = {
            before: uploadDataFormater,
            after: function (data) {
                $scope.editStat.selectedScene.background = data.fileName;
            },
            onError: backendService.errLogger
        };

        /**
         * 保存编辑好的项目JSON数据
         */

        $scope.$on('package.save', function () {

            backendService.savePackage($scope.package, function () {
                notifyService.notify('已保存！');
            });

        });

        $scope.$on('goview.roadmap', function () {
            $location.path('/roadmap/' + $routeParams.pkgId);
        });

        var transData;
        /**
         * 响应键盘动作
         */

        $scope.$on('keydown', function (onEvent, keyEvent) {
            switch (keyEvent.keyCode) {
                case 8:
                    // 酌情阻止 Backspace 后退
                    if (keyEvent.target.tagName === 'INPUT'|| angular.element(keyEvent.target).attr('contenteditable')) {
                        // 如果焦点在输入框内，则阻止冒泡
                        keyEvent.stopPropagation();
                    }
                    else if ($scope.editStat.selectedElement) {
                        // 如果有选中 element
                        keyEvent.preventDefault();
                        keyEvent.stopPropagation();
                        $scope.$apply();
                    } else if (!window.confirm('确认：返回工程列表？\n未保存的修改将会丢失')) {
                        // 确认的话，则后退到列表页
                        keyEvent.preventDefault();
                        keyEvent.stopPropagation();
                    }
                    break;
                case 67:
                    // ctrl或者meta + c 复制
                    if (keyEvent.ctrlKey || keyEvent.metaKey){
                        $scope.$broadcast('copy-element');
                    }
                    break;
                case 86:
                    // ctrl或者meta + v 粘贴
                    if (keyEvent.ctrlKey || keyEvent.metaKey){
                        $scope.$broadcast('paste-element');
                    }
                    break;
            }
        });

        $scope.$on('delete-element', function (ev, el) {
            editService.removeElement($scope.editStat.selectedScene, el);
            ev.stopPropagation();
        });


        // 监听复制事件
        $scope.$on('copy-element', function(){
            if (!!$scope.editStat.selectedElement){
                var elemkey = $scope.editStat.selectedElement.$$hashKey;
                $scope.$broadcast('copy-element-' + elemkey);
            }
        });

        // 监听粘贴
        $scope.$on('paste-element', function(){
            var elemkey = $scope.editStat.selectedElement.$$hashKey;
            $scope.$broadcast('paste-element-' + elemkey);
        });
    });
