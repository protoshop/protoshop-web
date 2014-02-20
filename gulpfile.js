var path = require('path'),
  gulp = require('gulp'),
  gutil = require('gulp-util'),
  express = require('express'),
  tinylr = require('tiny-lr'),
  connectlr = require('connect-livereload'),
  open = require('open');

var EXPRESS_PORT = 9999;
var EXPRESS_ROOT = __dirname + '/app';
var LIVERELOAD_PORT = 35729;

var createServers = function (port, lrport) {

  // App Server
  var app = express();
  app.use(connectlr());
  app.use(express.static(path.resolve(EXPRESS_ROOT)));
  app.listen(port, function () {
    gutil.log('Listening on', port, EXPRESS_ROOT);
  });

  // Livereload Server
  var lr = tinylr();
  lr.listen(lrport, function () {
    gutil.log('LR Listening on', lrport);
  });

  // Notify livereload of changes detected
  var noti = function (evt) {
    gutil.log(gutil.colors.cyan(evt.path), 'changed');
    lr.changed({
      body: {
        files: [evt.path]
      }
    })
  };

  return {
    lr: lr,
    app: app,
    noti: noti
  };
};

var servers = createServers(EXPRESS_PORT, LIVERELOAD_PORT);

gulp.task('serverdev', function () {
  gulp.watch(["./app/**/*", "!./app/node_modules/**/*"], servers.noti);
  open('http://localhost:9999');
});

gulp.task('default', ['serverdev']);
