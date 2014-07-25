<h1 align="center"> Protoshop Web </h1>
<h5  align="center">The WebApp for <a href="http://protoshop.io">Protoshop</a></h5>

此项目是 [Protoshop](https://github.com/protoshop) 的组成部分，负责在浏览器中创建原型。需要搭配[服务器端](https://github.com/protoshop/protoshop-server)使用。生成的项目可在移动终端查看（[iOS](https://github.com/protoshop/protoshop-ios)/[Android](https://github.com/protoshop/protoshop-android)）。

Protoshop 项目运行在 [protoshop.io](http://protoshop.io) 上。

## 本地预览

按下文安装完开发工具依赖之后，在 webapp 目录下执行命令 `gulp server` 即可启动本地服务器，预览项目。

## 开发工具依赖

克隆版本库之后，在本地安装如下依赖软件包：

1. Node.js & npm (http://nodejs.org/download/)
2. Bower (http://bower.io/)
3. Gulp (http://gulpjs.com/)

## 初始化本地开发环境

在项目目录下执行命令：

1. `npm install` —— 安装 node 模组
1. `bower install` —— 加载第三方库
1. `gulp server` —— 启动本地服务器

其他命令：

1. `gulp` -- 列出所有可用的 gulp 任务
1. `gulp build` -- 构建项目到 dist 目录

## 部署（Ctrip内部使用）

执行命令 `gulp dist` —— 发布 WebApp 界面代码到 Beta 服务器
执行命令 `gulp dist:ctqa` -- 发布 WebApp 界面代码到 protoshop.ctripqa.com
执行命令 `gulp dist:io` -- 发布 WebApp 界面代码到 protoshop.io

* 发布应由专人负责
* 在发布之前应执行 `gulp server:dist` 测试 build 之后的 App 运行是否完整

## 开发规范

- HTML、CSS代码使用tab作为缩进符，JavaScript代码使用2个空格作为缩进符
- 代码*推送到服务器仓库*之前要做的事情：
  1. 本地运行`gulp lint`命令，执行代码规范检查
  2. 本地运行`gulp server`命令，检查应用运行功能完整、控制台无报错(如无后续用途，控制台输出的调试信息也要清理)  
  之后即可推送到服务器仓库。
- 代码*部署到应用服务器*之前要做的事情：
  1. 部署之前要检查编译压缩后的应用是否功能完整、控制台无报错无调试记录 
