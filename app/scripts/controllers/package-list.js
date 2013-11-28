'use strict';

angular.module('toHELL')
  .controller('PackageListCTRL', ['$scope', '$http', '$location', 'Global', function ($scope, $http, $location, Global) {
    
    // To get data & set list.
    $scope.refreshList = function(){
      $http.get(Global.apiHost + 'package/list.json')
        .success(function (data) {
          $scope.packageList = data.list;
        });
    };

    // Init list
    $scope.refreshList();

    $scope.editPackage = function (pkg) {
      $location.path('/package/' + pkg.id);
    };

    $scope.deletePackage = function (pkg) {
      $http.delete(Global.apiHost + 'package/' + pkg.id)
        .success(function(){
          $scope.refreshList();
        });
    };

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