'use strict';

angular.module('toHELL', [
    'ngCookies',
    'ngResource',
    'ngSanitize',
    'ngRoute'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'package.html',
        controller: 'PackageCTRL'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
