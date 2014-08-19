'use strict';

angular.module('toHELL', [
    'btford.modal',
    'ngCookies',
    'ngResource',
    'ngSanitize',
    'ngRoute',
    'ngAnimate'
])

/**
 * 路由配置
 */

    .config(function ($routeProvider, $httpProvider) {

        $routeProvider
            .when('/', {
                templateUrl: 'partials/pg-login.html',
                controller: 'LoginCTRL'
            })
            .when('/help/', {
                templateUrl: 'partials/pg-help.html'
            })
            .when('/register/', {
                templateUrl: 'partials/pg-register.html',
                controller: 'RegisterCTRL'
            })
            .when('/list/', {
                templateUrl: 'partials/pg-pkglist.html',
                controller: 'PackageListCTRL'
            })
            .when('/package/:pkgId', {
                templateUrl: 'partials/pg-pkgedit.html',
                controller: 'PackageEditCTRL'
            })
            .when('/roadmap/:pkgId',{
                templateUrl: 'partials/pg-roadmap.html',
                controller: 'roadMapCTRL'
            })
            .otherwise({
                redirectTo: '/'
            });

        $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

        // for CORS, http://www.tuicool.com/articles/eQbq2e
        $httpProvider.defaults.useXDomain = true;
        delete $httpProvider.defaults.headers.common['X-Requested-With'];

    })

    .run(function (ENV) {

        // 配置 <body/> 上的类名
        angular.element(document.body).addClass('env-' + ENV.env);
    });
