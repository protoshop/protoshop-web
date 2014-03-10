// The Great Gulp
var gulp = require('gulp');
var $ = require('gulp-load-plugins')();

var LOCAL_PORT = 9999;
var SOURCE_ROOT = __dirname + '/app';
var BUILD_ROOT = __dirname + '/dist';
var BROWSER = 'Google Chrome Canary';

/**
 * =====================================
 *                 Launch Local Servers
 * =====================================
 */

var express = require('express');
var tinylr = require('tiny-lr');
var connectlr = require('connect-livereload');
var open = require('open');
var path = require('path');

var LIVERELOAD_PORT = 35729;

function createServers (root, port, lrport) {

  // App Server
  var app = express();
  console.log(path.resolve(root));
  app.use(connectlr());
  app.use(express.static(path.resolve(root)));
  app.listen(port, function () {
    $.util.log('Listening on', port, SOURCE_ROOT);
  });

  // Livereload Server
  var lr = tinylr();
  lr.listen(lrport, function () {
    $.util.log('LR Listening on', lrport);
  });

  // Notify livereload of changes detected
  var onchange = function (evt) {
    $.util.log($.util.colors.cyan(evt.path), 'changed');
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
}

gulp.task('server:dev', function () {
  var servers = createServers(SOURCE_ROOT, LOCAL_PORT, LIVERELOAD_PORT);
  gulp.watch(['./app/**/*', '!./app/node_modules/**/*'], servers.onchange);
  open('http://localhost:9999');
});

gulp.task('server:dist', function () {
  var servers = createServers(BUILD_ROOT, LOCAL_PORT, LIVERELOAD_PORT);
  gulp.watch([BUILD_ROOT + '/**.*'], servers.onchange);
  open('http://localhost:9999');
});

/**
 * =====================================
 *                             Building
 * =====================================
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

/**
 * =====================================
 *                         Distribution
 * =====================================
 */

function sh(commands) {
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
}

function distribution(tar) {
  var targets = {
    prod: 'sxxie@wxddb1.qa.nt.ctripcorp.com:/usr/local/httpd/htdocs/tohell/html/',
    beta: 'sxxie@wxddb1.qa.nt.ctripcorp.com:/usr/local/httpd/htdocs/beta/html/'
  };
  var rsyncParams = ' -avz -e ssh --delete --exclude=.git* --exclude=*.scss --exclude=node_modules';
  var command = 'rsync ' + BUILD_ROOT + '/ ' + targets[tar] + rsyncParams;

  sh(command);
}

gulp.task('dist', function () {
  distribution('beta');
});

gulp.task('dist:prod', function () {
  distribution('prod');
});

/**
 * =====================================
 *                        General Tasks
 * =====================================
 */

gulp.task('server', ['server:dev']);

gulp.task('default', ['server:dev']);
