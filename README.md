## 本地预览

按下文安装完开发工具依赖之后，在 webapp 目录下执行命令 `gulp server` 即可启动本地服务器，预览项目。

## 开发工具依赖

克隆版本库之后，在本地安装如下依赖软件包：

1. Node.js & npm (http://nodejs.org/download/)
2. Bower (http://bower.io/)
3. Gulp (http://gulpjs.com/)

## 初始化本地开发环境

- 在 webapp 目录下执行命令 `npm install` —— 安装 node 模组
- 在 webapp 目录下执行命令 `bower install` —— 安装 bower 依赖
- 在 webapp 目录下执行命令 `gulp server` —— 启动本地服务器

在 webapp 目录下执行命令 `gulp dist` —— 发布 WebApp 界面代码到 Beta 服务器

## 开发规范

- HTML、CSS代码使用tab作为缩进符，JavaScript代码使用2个空格作为缩进符
- 代码*推送到服务器仓库*之前要做的事情：
  1. 本地运行`gulp hint`命令，执行JSHint检查
  2. 本地运行`gulp server`命令，检查应用运行功能完整、控制台无报错(如无后续用途，控制台输出的调试信息也要清理)  
  之后即可推送到服务器仓库。
- 代码*部署到应用服务器*之前要做的事情：
  1. 部署之前要检查编译压缩后的应用是否功能完整、控制台无报错无调试记录 
