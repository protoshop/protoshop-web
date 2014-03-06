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

gulp.task('connect:dev', $.connect.server({
  livereload: true,
  root: [SOURCE_ROOT],
  port: LOCAL_PORT,
  open: { browser: BROWSER }
}));

gulp.task('connect:dist', $.connect.server({
  livereload: true,
  root: [BUILD_ROOT],
  port: LOCAL_PORT,
  open: { browser: BROWSER }
}));

// Log & Notify Livereload
function onchange(event) {
  $.util.log($.util.colors.cyan(event.path), 'changed');
  return gulp.src(event.path)
    .pipe($.connect.reload());
}

gulp.task('server', ['connect:dev'], function () {
  gulp.watch([
      SOURCE_ROOT + '/**/*',
      '!' + SOURCE_ROOT + '/node_modules/**/*'
  ], onchange);
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

  sh('rsync ' + BUILD_ROOT + '/ ' + targets[tar].beta + rsyncParams);
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

gulp.task('default', ['server']);
