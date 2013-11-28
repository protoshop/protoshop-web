'use strict';

angular.module('toHELL')
  .controller('PackageListCTRL', ['$scope', '$http', '$location', 'Global', function ($scope, $http, $location, Global) {
    $http.get(Global.apiHost + '/package/list.json')
      .success(function (data) {
        console.log(data);
        $scope.packageList = data.list;
      });

    $scope.editPackage = function (pkg) {
      $location.path('/package/' + pkg.id);
    };

    $scope.deletePackage = function (pkg) {
      console.log('delete package:', pkg);
    };

    $scope.showCreateDialog = false;
    $scope.toggleCreateDialog = function () {
      $scope.showCreateDialog = !$scope.showCreateDialog;
    };

    $scope.createPackage = function () {
      var pkg = $scope.newPackage;
      $http.post(
        Global.apiHost + 'package/new.json',
        {
          appname: pkg.name,
          comment: pkg.desc
        }
      ).success(function (data) {
          $location.path('/package/' + data.id);
        });
    };
  }]);