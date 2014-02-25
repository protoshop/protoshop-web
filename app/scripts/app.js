'use strict';

var isBeta = /(beta|:9999)/.test(window.location.href);

angular.module('toHELL', [
  'btford.modal',
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ngRoute',
  'ngAnimate'
])
  .config(['$routeProvider', '$httpProvider', function ($routeProvider, $httpProvider) {

    $routeProvider
      .when('/', {
        templateUrl: 'templates/login.html',
        controller: 'LoginCTRL'
      })
      .when('/register/', {
        templateUrl: 'templates/register.html',
        controller: 'RegisterCTRL'
      })
      .when('/list/', {
        templateUrl: 'templates/package-list.html',
        controller: 'PackageListCTRL'
      })
      .when('/package/:pkgId', {
        templateUrl: 'templates/package-edit.html',
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
    pkgHost: isBeta ? 'http://wxddb1.qa.nt.ctripcorp.com/betapackages/'
      : 'http://wxddb1.qa.nt.ctripcorp.com/packages/',
    apiHost: isBeta ? 'http://wxddb1.qa.nt.ctripcorp.com/tohellbeta/'
      : 'http://wxddb1.qa.nt.ctripcorp.com/tohell/',
    errDesc: {
      // 登陆接口 /login/
      1001: '请求方式错误',
      1002: '用户名或密码不正确',
      1003: '邮箱为空',
      1004: '密码为空',
      1005: '邮箱错误',
      // 注册接口 /register/
      2001: '请求方式错误',
      2002: '用户已存在',
      2003: '服务器内部错误',
      2004: '用户名为空',
      2005: '密码为空',
      // 获取用户信息接口 /usrinfo/
      3001: '请求方式错误',
      3002: '用户名不存在',
      // 更新用户信息接口 /updateuser/
      4001: '请求方式错误',
      4002: '用户名为空',
      4003: '用户名不存在',
      // 删除工程接口 /deleteProject/
      6001: '请求方式错误',
      6002: 'owner为空',
      6003: 'appid为空',
      6004: '服务器内部错误'
    },
    errLogger: function (data, status, headers, config) {
      console.log('Status:', status, '\nData  :', data, '\nConfig:', config);
    }
  }
);
