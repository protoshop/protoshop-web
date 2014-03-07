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
    $http.post(GLOBAL.apiHost + 'shareList/', {
      token: loginService.getLoggedInUser().token,
      appid: $scope.appID
    })
    .success(function(res){
      switch (res.status) {
      case '1':
      console.log(res.results);
        $scope.sharedFellows = res.results;
        break;
      default:
        var errDesc = GLOBAL.errDesc[res.error_code] || '未知错误';
        console.log('获取分享列表 Error: ', errDesc, res);
      }
    });

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
//          $scope.sharedFellows = res.results;
          console.log(res.results);
          $scope.lookupKeyword = '';
          $scope.hiFellows = [];
          break;
        default:
          var errDesc = GLOBAL.errDesc[res.error_code] || '未知错误';
          console.log('添加分享伙伴 Error: ', errDesc, res);
        }
      });
    };
    
    $scope.removeFellow = function(fellow){
//      $http.post(GLOBAL.apiHost + 'removeShare/', {
//        token: loginService.getLoggedInUser().token,
//        appid: $scope.appID
//      })
//      .success(function(res){
//        switch (res.status) {
//        case '1':
//          console.log(res.results);
//          $scope.sharedFellows = res.results;
//          break;
//        default:
//          var errDesc = GLOBAL.errDesc[res.error_code] || '未知错误';
//          console.log('移除共享好友 Error: ', errDesc, res);
//        }
//      });
      console.log(fellow);
    };
  }
]);
