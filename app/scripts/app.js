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
      // 用户登陆接口 /login/
      1001: "请求方式错误",
      1002: "用户名或密码不正确",
      1003: "邮箱为空",
      1004: "密码为空",
      // 用户注册接口 /register/
      2001: "请求方式错误",
      2002: "用户已存在",
      2003: "服务器内部错误",
      2004: "用户名为空",
      2005: "密码为空",
      2006: "邮箱格式错误",
      // 修改密码接口 //
      3001: "请求方式错误",
      3002: "Token无效需要重新登录",
      3003: "密码为空",
      3004: "旧密码错误",
      3005: "服务器内部错误",
      // 获取用户信息接口 /usrinfo/
      4001: "token为空",
      4002: "token无效",
      4003: "服务器内部错误",
      // 更新用户信息接口 /updateuser/
      5001: "token为空",
      5002: "token无效",
      5003: "服务器内部错误",
      // 创建工程接口 /createProject/
      6001: "请求方式错误",
      6002: "token无效",
      6003: "服务器内部错误",
      // 删除工程接口 /deleteProject/
      7001: "请求方式错误",
      7002: "token为空",
      7003: "appid为空",
      7004: "token无效",
      7005: "服务器内部错误",
      // 保存工程接口 //
      8001: "请求方式错误",
      8002: "用户名为空",
      8003: "用户名不存在",
      // 获取工程接口 //
      9001: "请求方式错误",
      9002: "token无效",
      9003: "服务器内部异常",
      // 获取工程列表接口
      10001: "token为空",
      10002: "token认证失败",
      10003: "服务器内部错误",
      // 分享工程接口
      11001: "请求方式错误",
      11002: "token为空或appid为空或user为空或option为空",
      11003: "分享的用户不存在",
      11004: "未知操作(option为非12)",
      // 获取分享用户列表
      12001: "请求方式错误",
      12002: "token为空",
      12003: "token失效",
      // 意见反馈
      13001: "请求方式错误",
      13002: "邮箱为空",
      13003: "反馈内容为空",
      13004: "反馈来源为空",
      13005: "服务器内部错误",
      // iOS 注册推送token
      14001: "请求方式错误",
      14002: "token为空",
      14003: "服务器内部错误",
      // 生成ZIP包
      15001: "请求方式错误",
      15002: "服务器IO操作错误",
      15003: "Lua解析错误",
      15004: "Lua解析异常",
      15005: "token失效",
      // 上传图片接口
      0: "上传失败",
      1: "上传成功"
    },
    errLogger: function (data, status, headers, config) {
      console.log('Status:', status, '\nData  :', data, '\nConfig:', config);
    }
  }
);
