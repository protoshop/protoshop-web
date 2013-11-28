'use strict';

angular.module('toHELL')
  .controller('PackageListCTRL', ['$scope', '$http', '$location', 'Global', function ($scope, $http, $location, Global) {

    // To get data & set list.
    $scope.refreshList = function () {
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
        .success(function () {
          $scope.refreshList();
        });
    };

    $scope.toggleCreateDialog = function () {
      $scope.showCreateDialog = !$scope.showCreateDialog;
    };

    $scope.newPackageConfig = {
      appName: '',
      comment: ''
    }
    $scope.createPackage = function () {
      var postData = {
        context: $scope.newPackageConfig
      };
      $http.post('http://wxddb1.qa.nt.ctripcorp.com/tohell/createPoject/', postData)
        .success(function (data) {
          $location.path('/package/' + data.appID);
        });
    };
  }]);