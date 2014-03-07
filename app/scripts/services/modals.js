'use strict';

angular.module('toHELL')
.factory('dialogShare', ['btfModal', function (Modal) {
  return Modal({
    controller: 'DialogShareCtrl',
    controllerAs: 'modal',
    templateUrl: 'partials/dialog-share.html'
  })
}])
.controller('DialogShareCtrl', [
  'dialogShare',
  '$scope',
  'GLOBAL',
  '$http',
  'loginService',
  function (dialogShare, $scope, GLOBAL, $http, loginService) {

    this.closeMe = dialogShare.deactivate;
    angular.element('.share-input').focus();

    $scope.sharedFellows = [];
    $http.get(GLOBAL.apiHost + 'sharelist/')

    $scope.hiFellows = [];
    $scope.lookupKeyword = '';

    $scope.lookupFellows = function () {
      if ($scope.lookupKeyword === '') {
        $scope.hiFellows = [];
      } else {
        $http.post(GLOBAL.apiHost + 'searchUser/', {
          token: loginService.getLoggedInUser().token,
          appid: $scope.appID,
          keyword: $scope.lookupKeyword
        })
        .success(function (res) {
          $scope.hiFellows = res.results;
        });
      }
    };

    $scope.addFellow = function (fellow) {

      $http.post(GLOBAL.apiHost + 'share/', {
        token: loginService.getLoggedInUser().token,
        appid: $scope.appID,
        user: fellow.email,
        option: '1'
      })
      .success(function (res) {
        switch (res.status) {
        case '1':
//          $scope.fellows = res.results;
          console.log(res.results);
          $scope.lookupKeyword = '';
          break;
        default:
          var errDesc = GLOBAL.errDesc[res.error_code] || '未知错误';
          console.log('添加分享伙伴 Error: ', errDesc, res);
        }
      });
    }
  }
]);
