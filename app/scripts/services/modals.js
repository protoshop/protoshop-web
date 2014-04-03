'use strict';

angular.module('toHELL')
.factory('dialogShare', function (btfModal) {
  return btfModal({
    controller: 'DialogShareCtrl',
    controllerAs: 'modal',
    templateUrl: 'partials/dialog-share.html'
  });
})
.controller('DialogShareCtrl', function (dialogShare, $scope, backendService, accountService) {

  this.closeMe = dialogShare.deactivate;
  angular.element('.share-input').focus();

  /**
   * 显示已经在分享列表中的好友
   */

  $scope.sharedFellows = [];

  backendService.getProjectSharer({
    token: accountService.getLoggedInUser().token,
    appid: $scope.appID
  }, function (data) {
    $scope.sharedFellows = data;
  });

  /**
   * 查询要分享的好友
   */

  $scope.hiFellows = [];
  $scope.lookupKeyword = '';

  $scope.lookupFellows = function () {
    if ($scope.lookupKeyword === '') {
      $scope.hiFellows = [];
    } else {
      backendService.searchUser({
        token: accountService.getLoggedInUser().token,
        appid: $scope.appID,
        keyword: $scope.lookupKeyword
      }, function (data) {
        $scope.hiFellows = data;
      });
    }
  };

  /**
   * 设置某好友的分享权限
   */

  function setShare(fellow, allow) {

    var args = {
      token: accountService.getLoggedInUser().token,
      appid: $scope.appID,
      user: fellow.email,
      option: allow ? '1' : '2',
      permission: 1
    };

    backendService.setShare(args, function (data) {
      $scope.sharedFellows = data;
      $scope.lookupKeyword = '';
      $scope.hiFellows = [];
    });

  }

  // 添加分享好友
  $scope.addFellow = function (fellow) {
    setShare(fellow, true);
  };

  // 移除分享好友
  $scope.removeFellow = function (fellow) {
    setShare(fellow, false);
  };
});
