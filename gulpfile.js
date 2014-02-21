var path = require('path');
var gulp = require('gulp');
var gutil = require('gulp-util');
var express = require('express');
var tinylr = require('tiny-lr');
var connectlr = require('connect-livereload');
var open = require('open');

var LIVERELOAD_PORT = 35729;
var EXPRESS_PORT = 9999;
var EXPRESS_ROOT = __dirname + '/app';
var BUILD_ROOT = __dirname + '/dist';

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
  var servers = createServers(EXPRESS_PORT, LIVERELOAD_PORT);
  gulp.watch(["./app/**/*", "!./app/node_modules/**/*"], servers.onchange);
  open('http://localhost:9999');
});

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
      css: [minifycss(), 'concat', rev()],
      html: [minifyhtml({empty: true})],
      js: [uglify(), rev()]
    }))
    .pipe(gulp.dest('./dist/'));
});

gulp.task('copy', function () {

  // Static files
  gulp.src([
      '!' + EXPRESS_ROOT + '/*.html',
      EXPRESS_ROOT + '/*.*',
      EXPRESS_ROOT + '/font/**/*'
  ], {base: EXPRESS_ROOT})
    .pipe(gulp.dest('./dist'));

  // HTML templates
  gulp.src([
      EXPRESS_ROOT + '/partials/**/*',
      EXPRESS_ROOT + '/templates/**/*'
  ], {base: './app'})
    .pipe(gulp.dest('./dist'));
});

gulp.task('clean', function () {
  return gulp.src([BUILD_ROOT], {read: false})
    .pipe(clean());
});

gulp.task('default', ['serverdev']);
gulp.task('build', ['clean'], function () {
  gulp.start('usemin', 'copy');
});
