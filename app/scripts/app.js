'use strict';

angular.module('toHELL', [
    'ngCookies',
    'ngResource',
    'ngSanitize',
    'ngRoute',
    'ngAnimate'
  ])
  .config(['$routeProvider', '$httpProvider', function ($routeProvider, $httpProvider) {

    $routeProvider
      .when('/', {
        templateUrl: 'package-list.html',
        controller: 'PackageListCTRL'
      })
      .when('/package/:pkgId', {
        templateUrl: 'package-edit.html',
        controller: 'PackageEditCTRL'
      })
      .otherwise({
        redirectTo: '/'
      });

    $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

    // for CORS, http://www.tuicool.com/articles/eQbq2e
    $httpProvider.defaults.useXDomain = true;
    delete $httpProvider.defaults.headers.common['X-Requested-With'];

  }])
  .constant('GLOBAL', {
    host: 'http://wxddb1.qa.nt.ctripcorp.com/',
    apiHost: 'http://wxddb1.qa.nt.ctripcorp.com/tohell/',
    errLogger: function (data, status, headers, config) {
      console.log('Status:', status, '\nData  :', data, '\nConfig:', config);
    }
  }
);
