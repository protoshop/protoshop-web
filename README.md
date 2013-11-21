## 本地测试

页面文件存放于 webapp/app 目录下，以浏览器打开即可预览。

## 开发工具依赖

克隆版本库之后，在本地安装如下依赖软件包：

1. Node.js & npm (http://nodejs.org/download/)
2. yeoman (包含 bower & grunt) (http://yeoman.io/)

## 初始化本地开发环境

在 webapp 目录下执行命令 `npm install` —— 安装 node 模组
在 webapp 目录下执行命令 `bower install` —— 安装 bower 依赖
在 webapp 目录下执行命令 `grunt server` —— 启动本地服务器

## 开发规范


- 提交代码注释以『WA』开头（以区分项目中的其他子工程），三种分类：『WA样式』、『WA功能』、『WA代码』。所有既非样式调整，又非功能增减的修改都归类为代码整理，即『WA代码』
- HTML、CSS代码使用tab作为缩进符，JavaScript代码使用2个空格作为缩进符
