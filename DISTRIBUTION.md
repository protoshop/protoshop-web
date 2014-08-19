# Web 代码发布流程

1. 进⼊入本地仓库
1. 执⾏ `gulp build` 命令编译JS（可能会出错,这个时候出错⼤部分是由于页面代码有问题导致，按照错误提⽰排查修改就好了）
1. **【重要】** 执行 `gulp server:dist` 测试编译后的代码是否运行良好，功能完整无错
1. 执行 `gulp dist:io` 发布到 protoshop.io 服务器  
另: `glup dist:ctqa` 发布到 protoshop.ctripqa.com 正式环境；`glup dist:debug` 发布到 protoshop.ctripqa.com 测试环境
1. 发布完成

### 发布过程中可能遇到问题

1. npm 发生任何问题  
到 http://nodejs.org/ 安装最新版 Nodejs 既可
1. 缺失全局组件 bower 或 gulp  
执行 `npm install bower -g` 和 `npm install gulp -g`
1. 缺失本地组件(gulp等)或第三方库(jquery等)  
执行 `bower install` 和 `npm install`
1. npm 安装全局组件出错  
通常是文件夹或文件权限错误，碰到这些权限问题时可以执⾏ sudo chown -R ‘whoami’ 文件夹/⽂件路径来解决问题
