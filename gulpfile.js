var path = require('path');
var gulp = require('gulp');
var gutil = require('gulp-util');
var express = require('express');
var tinylr = require('tiny-lr');
var connectlr = require('connect-livereload');
var open = require('open');

/**************************************
 *                 Launch Local Servers
 */

var LIVERELOAD_PORT = 35729;
var EXPRESS_PORT = 9999;
var SOURCE_ROOT = __dirname + '/app';
var BUILD_ROOT = __dirname + '/dist';

var createServers = function (root, port, lrport) {

  // App Server
  var app = express();
  app.use(connectlr());
  app.use(express.static(path.resolve(root)));
  app.listen(port, function () {
    gutil.log('Listening on', port, SOURCE_ROOT);
  });

  // Livereload Server
  var lr = tinylr();
  lr.listen(lrport, function () {
    gutil.log('LR Listening on', lrport);
  });

  // Notify livereload of changes detected
  var onchange = function (evt) {
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
    onchange: onchange
  };
};

gulp.task('serverdev', function () {
  var servers = createServers(SOURCE_ROOT, EXPRESS_PORT, LIVERELOAD_PORT);
  gulp.watch(['./app/**/*', '!./app/node_modules/**/*'], servers.onchange);
  open('http://localhost:9999');
});

gulp.task('serverdist', function () {
  var servers = createServers(BUILD_ROOT, EXPRESS_PORT, LIVERELOAD_PORT);
  gulp.watch([BUILD_ROOT + '/**.*'], servers.onchange);
  open('http://localhost:9999');
});

/**************************************
 *                       Building Works
 */

//var sass = require('gulp-ruby-sass');
//var jshint = require('gulp-jshint');

var usemin = require('gulp-usemin');
var uglify = require('gulp-uglify');
var minifyhtml = require('gulp-minify-html');
var minifycss = require('gulp-minify-css');
var imagemin = require('gulp-imagemin');
var clean = require('gulp-clean');
var rev = require('gulp-rev');

gulp.task('usemin', function () {
  gulp.src('./app/*.html')
    .pipe(usemin({
      css: [minifycss(), rev()],
      js: [uglify(), rev()],
      html: [minifyhtml({empty: true})]
    }))
    .pipe(gulp.dest(BUILD_ROOT));
});

gulp.task('imagemin', function () {
  gulp.src(SOURCE_ROOT + '/images/*.*', {base: SOURCE_ROOT})
    .pipe(imagemin())
    .pipe(gulp.dest(BUILD_ROOT));
});

gulp.task('copy', function () {
  gulp.src([
      '!' + SOURCE_ROOT + '/*.html',
      SOURCE_ROOT + '/*.*',
      SOURCE_ROOT + '/font/**/*',
      SOURCE_ROOT + '/partials/**/*',
      SOURCE_ROOT + '/templates/**/*'
  ], {base: SOURCE_ROOT})
    .pipe(gulp.dest(BUILD_ROOT));
});

gulp.task('clean', function () {
  return gulp.src([BUILD_ROOT], {read: false})
    .pipe(clean());
});

gulp.task('build', ['clean'], function () {
  gulp.start('usemin', 'imagemin', 'copy');
});

/**************************************
 *                         Distribution
 */

var sh = function (commands) {
  var exec = require('child_process').exec;
  var sys = require('sys');
  for (var i = 0, l = arguments.length; i < l; i++) {
    exec(arguments[i], function (error, stdout, stderr) {
      if (error != null) {
        sys.print('exec error: ' + error);
      } else {
        sys.print(stdout);
        sys.print(stderr);
      }
    });
  }
};

gulp.task('dist', function () {
  var target = {
    prod: 'sxxie@wxddb1.qa.nt.ctripcorp.com:/usr/local/httpd/htdocs/tohell/html/',
    beta: 'sxxie@wxddb1.qa.nt.ctripcorp.com:/usr/local/httpd/htdocs/beta/html/'
  };
  var rsyncParams = ' -avz -e ssh --delete --exclude=.git* --exclude=*.scss --exclude=node_modules';

  sh('rsync ' + BUILD_ROOT + '/ ' + target.beta + rsyncParams);
});

/**************************************
 *                        General Tasks
 */

gulp.task('default', ['serverdev']);
