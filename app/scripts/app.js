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
        templateUrl: 'views/project.html',
        controller: 'ProjectCTRL'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
