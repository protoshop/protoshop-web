// The Great Gulp
var gulp = require('gulp');
var $ = require('gulp-load-plugins')();

var LOCAL_PORT = 9999;
var SOURCE_ROOT = './app';
var BUILD_ROOT = './dist';

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

function createServers(root, port, lrport) {

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

gulp.task('server:dev', ['html2js'], function () {
  var servers = createServers(SOURCE_ROOT, LOCAL_PORT, LIVERELOAD_PORT);
  gulp.watch(['./app/**/*', '!./app/node_modules/**/*'], servers.onchange);
  open('http://localhost:9999');
});

gulp.task('server:dist', ['build'], function () {
  var servers = createServers(BUILD_ROOT, LOCAL_PORT, LIVERELOAD_PORT);
  gulp.watch([BUILD_ROOT + '/**.*'], servers.onchange);
  open('http://localhost:9999');
});

/**
 * =====================================
 *                              Linting
 * =====================================
 */

gulp.task('lint', function () {
  return gulp.src([
    SOURCE_ROOT + '/scripts/**/*.js',
    '!' + SOURCE_ROOT + '/scripts/libs/**/*.js'
  ])
  .pipe($.jshint('.jshintrc'))
  .pipe($.jshint.reporter('jshint-stylish'))
  .pipe($.size());
});

/**
 * =====================================
 *                             Building
 * =====================================
 */

//var sass = require('gulp-ruby-sass');
//var jshint = require('gulp-jshint');

gulp.task('usemin', ['html2js'], function () {
  gulp.src('./app/*.html')
  .pipe($.usemin({
    css: [$.autoprefixer(), $.minifyCss(), $.rev()],
    js: [$.ngmin(), $.uglify(), $.rev()],
    html: [$.minifyHtml({empty: true})]
  }))
  .pipe(gulp.dest(BUILD_ROOT));
});

gulp.task('html2js', function () {
  return gulp.src(SOURCE_ROOT + "/partials/*.html")
//  .pipe($.minifyHtml({
//    empty: true
//  }))
  .pipe($.ngHtml2js({
    moduleName: "toHELL",
    prefix: "partials/"
  }))
  .pipe($.concat('partials.js'))
  .pipe(gulp.dest(BUILD_ROOT + "/scripts/"));
});

gulp.task('imagemin', function () {
  var imgSrc = './app/images/*.*';
  var imgDst = './dist/images';

  gulp.src(imgSrc)
  .pipe($.changed('./dist/images'))
  .pipe($.imagemin())
  .pipe(gulp.dest(imgDst));
});

gulp.task('copy', function () {
  gulp.src([
    '!' + SOURCE_ROOT + '/*.html',
    SOURCE_ROOT + '/*.*',
    SOURCE_ROOT + '/scripts/assets/*.*',
    SOURCE_ROOT + '/fonts/**/*'
  ], { base: SOURCE_ROOT })
  .pipe(gulp.dest(BUILD_ROOT));
});

gulp.task('clean', function () {
  return gulp.src([BUILD_ROOT], {read: false})
  .pipe($.clean());
});

gulp.task('build', ['usemin', 'imagemin', 'copy']);

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
    open: 'ProtoShop@protoshop.io:/var/www/ProtoShop/html/',
    ctqa: 'weiwuxu@10.2.254.48:/var/www/ProtoShop/html/',
    debug: 'weiwuxu@10.2.254.48:/var/www/Debug/html/'
  };
  var rsyncParams = ' -avz -e ssh --delete --exclude=.git* --exclude=*.scss --exclude=node_modules';
  var command = 'rsync ' + BUILD_ROOT + '/ ' + targets[tar] + rsyncParams;

  sh(command);
}

gulp.task('dist:open', function () {
  distribution('open');
});

gulp.task('dist:ctqa', function () {
  distribution('ctqa');
});

gulp.task('dist', function () {
  distribution('debug');
});

/**
 * =====================================
 *                        General Tasks
 * =====================================
 */

gulp.task('server', ['server:dev']);

gulp.task('default', $.taskListing);
