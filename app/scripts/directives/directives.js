'use strict';
(function () {
  var module = angular.module('toHELL');

  module.directive('pxUnit', function () {
    return {
      require: 'ngModel',
      link: function (scope, elm, attrs, ctrl) {
        ctrl.$parsers.unshift(function (viewValue) {
          ctrl.$setValidity('integer', true);
          // NOTE: value considered to be integer only.
          return parseInt(viewValue, 10);
        });
      }
    };
  });

  module.directive('timeUnit', function () {
    return {
      require: 'ngModel',
      link: function (scope, elm, attrs, ctrl) {
        ctrl.$parsers.unshift(function (viewValue) {
          // NOTE: value considered to be float only.
          return parseFloat(viewValue);
        });
      }
    };
  });

  module.directive('sceneListItem', [function () {
    return {
      restrict: 'A',
      link: function (scope, element) {
        // 只有真正属于增加场景的时候才需要聚焦。由于包的内容是异步加载的，
        // 如果缺少这样的判断，directive并不知道自己是包中已有的场景渲染出来的，
        // 还是由于后期手动添加的
        if (scope.editStat.sceneHasAdded) {
          var item = element.find('input:eq(0)');
          // FIXME: 很奇怪这里如果不延时则不能选中文字，只能聚焦
          // 可能是因为在函数执行后其他DOM元素的操作影响了文字的选中
          item.focus().select();
          scope.$evalAsync(function () {
            item.focus().select();
          }, 0);
        }

        // 增加拖拽排序 
        var dom = element[0];

        dom.draggable = true;

        dom.addEventListener('dragstart', function (e) {
          scope.deselectScene();
          e.dataTransfer.effectAllowed = 'move';
          e.dataTransfer.setData('scene', scope.scene.order);
          dom.classList.add('item-drag');
          return false;
        }, false);

        dom.addEventListener('dragend', function () {
          dom.classList.remove('item-drag');
          scope.selectScene(scope.scene);
          scope.$apply(); // NOTE: 迫使angular刷新DOM
          return false;
        }, false);

        dom.addEventListener('dragover', function (e) {
          // 迫使浏览器一定会产生drop事件
          // TODO: 如果在这里重排序，则有可能可以实时预览移动效果
          e.preventDefault();
          return false;
        }, false);

        dom.addEventListener('dragenter', function () {
          dom.classList.add('item-drag');
          scope.$apply();
          return false;
        }, false);

        dom.addEventListener('dragleave', function () {
          dom.classList.remove('item-drag');
          scope.$apply();
          return false;
        }, false);

        dom.addEventListener('drop', function (e) {
          // 禁用某些浏览器的默认行为
          if (e.stopPropagation) {
            e.stopPropagation();
          }

          var fromScene = e.dataTransfer.getData('scene');
          scope.orderScene(fromScene, scope.scene.order);
          dom.classList.remove('item-drag');

          scope.$apply(); // NOTE: 迫使angular刷新DOM
          return false;
        }, false);
      }
    };
  }]);

  /**
   * Monitor global key event & broadcast them
   */

  module.directive('keyEvents', [
    '$document',
    '$rootScope',
    function ($document, $rootScope) {
      return {
        restrict: 'A',
        link: function () {
          $document.bind('keydown', function (e) {
            $rootScope.$broadcast('keydown', e);
          });
        }
      };
    }
  ]);


  module.directive('notify', ['$document', 'notifyService', function ($document, notifyService) {

    return {
      restrict: 'AE',
      templateUrl: 'partials/notify.html',
      replace: true,
      link: function (scope) {
        scope.items = notifyService.getItems();
        scope.dismiss = function(item){
          notifyService.remove(item);
        }
      }
    };
  }]);

})();