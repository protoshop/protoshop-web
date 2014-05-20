## 本地预览

按下文安装完开发工具依赖之后，在 webapp 目录下执行命令 `grunt server` 即可启动本地服务器，预览项目。

## 开发工具依赖

克隆版本库之后，在本地安装如下依赖软件包：

1. Node.js & npm (http://nodejs.org/download/)
2. yeoman (包含 bower & grunt) (http://yeoman.io/)

## 初始化本地开发环境

- 在 webapp 目录下执行命令 `npm install` —— 安装 node 模组
- 在 webapp 目录下执行命令 `bower install` —— 安装 bower 依赖
- 在 webapp 目录下执行命令 `gulp server` —— 启动本地服务器

在 webapp 目录下执行命令 `gulp dist` —— 发布 WebApp 界面代码到 Beta 服务器

## 开发规范

- 提交代码注释以『WA』开头（以区分项目中的其他子工程），四种分类：『WA样式』、『WA功能』、『WA代码』、『WA文档』。
- HTML、CSS代码使用tab作为缩进符，JavaScript代码使用2个空格作为缩进符
- 代码*推送到服务器仓库*之前要做的事情：
  1. 本地运行`gulp hint`命令，执行JSHint检查
  2. 本地运行`gulp server`命令，检查应用运行功能完整、控制台无报错(如无后续用途，控制台输出的调试信息也要清理)  
  之后即可推送到服务器仓库。
- 代码*部署到应用服务器*之前要做的事情：
  1. 本地运行`gulp server:dist`命令，检查编译压缩后的应用是否功能完整、控制台无报错无调试记录  
  之后可将`dist`目录下的文件部署到 beta 服务器上。

## 前端测试

目前使用[karma](http://karma-runner.github.io/0.10/index.html)进行测试，所参考的资料主要是[这篇博客](http://www.yearofmoo.com/2013/01/full-spectrum-testing-with-angularjs-and-karma.html#testing-modules)。

### 安装karma

karma需要全局安装：`npm install -g karma`

目前karma的其他相关模块已写入了node的`package.json`。

### 使用karma

现在karma已和grunt集成，需要测试时可以直接运行`grunt test`，或单独选则某项测试：

* 单元测试：`grunt karma:unit`
  * 持续测试：`grunt karma:unit_auto`
* Midway测试：`grunt karma:midway`
  * 持续测试：`grunt karma:midway_auto`
* 端对端测试：`grunt karma:e2e`
  * 持续测试：`grunt karma:e2e_auto`