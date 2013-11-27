'use strict';

angular.module('toHELL', [
    'ngCookies',
    'ngResource',
    'ngSanitize',
    'ngRoute'
  ])
  .config(['$routeProvider',function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'package-list.html',
        controller: 'PackageListCTRL'
      })
      .when('/package/:pkgId', {
        templateUrl: 'package.html',
        controller: 'PackageCTRL'
      })
      .otherwise({
        redirectTo: '/'
      });
  }])
  .factory('Global',function(){
    return {
      'apiUrl': '/api/'
    };
  });
