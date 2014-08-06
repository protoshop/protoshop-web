# Web 代码发布流程

1.进⼊入本地仓库
2.执⾏行 `gulp build` 命令编译JS (中间可能会出错,这个时候出错⼤大部分是由于页面代码有问题导致的，按照错误提⽰排查修改就好了)
3.执⾏行 `gulp dist:io` (发布到protoshop.io服务器)  
  注: `glupdist:ctqa` 发布到 protoshop.ctripqa.com 正式环境；`glupdist:debug` 发布到 protoshop.ctripqa.com 测试环境
4.发布流程结束

### 发布过程中可能遇到问题

1. npm 发生任何问题  
到 http://nodejs.org/ 安装最新版 Nodejs 既可
1. 缺失全局组件 bower 或 gulp  
执行 `npm install bower -g` 和 `npm install gulp -g`
1. 缺失本地组件(gulp等)或第三方库(jquery等)  
执行 `bower install` 和 `npm install`
1. npm 安装全局组件出错  
通常是文件夹或文件权限错误，碰到这些权限问题时可以执⾏ sudo chown -R ‘whoami’ 文件夹/⽂件路径来解决问题
