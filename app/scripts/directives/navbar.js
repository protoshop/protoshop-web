angular.module('toHELL')

/**
 *  Navbar directive
 */

.directive('navbar', ['loginService', function (loginService) {
  return {
    restrict: 'AE',
    replace: true,
    templateUrl: 'partials/navbar.html',
    link: function ($scope) {

      /**
       *  Navbar Status
       */

      $scope.isLoggedIn = function () {
        return loginService.isLoggedIn();
      };

      /**
       *  登出账号
       */

      $scope.logout = function (e) {

        // 登出按钮的有效计时
        var readyTimeout = 1000;

        var tar = angular.element(e.target);

        if (tar.hasClass('ready')) {
          loginService.doLogout();
        } else {
          tar.addClass('ready');
          setTimeout(function () {
            tar.removeClass('ready');
          }, readyTimeout);
        }
        //
      };
    }
  }
}]);
