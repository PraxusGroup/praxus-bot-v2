'use strict';

var gulp = require('gulp');

// --------------------------------------------------------------------
// Plugins
// --------------------------------------------------------------------
var env = process.env.NODE_ENV || 'development';

var path        = require('path');
var fs          = require('fs');
var es          = require('event-stream');

var debug       = require('gulp-debug');
var watch 			= require('gulp-watch');
var plumber     = require('gulp-plumber');
var notify      = require('gulp-notify');
var changed 		= require('gulp-changed');
var loopback    = require('gulp-loopback-sdk-angular');


var raven         = require('raven');
var dsn = '' +
  '@app.getsentry.com/';

//var ravenClient = new raven.Client(dsn);

// Run sass alongside burbon (fastest way of sass compiling)
var sass        = require('gulp-sass');
var neat        = require('node-neat').includePaths;

// JS/CSS Injection Related Files
var inject      = require('gulp-inject');
var bowerFiles  = require('main-bower-files');
var angularSort = require('gulp-angular-filesort');

// Live Reload Enabled
var livereload  = require('gulp-livereload');

// --------------------------------------------------------------------
// BUILD PLUGINS
// --------------------------------------------------------------------

var concat      = require('gulp-concat');
var del 				= require('del');

//JS Modules
var uglify      = require('gulp-uglify');
var cssmin      = require('gulp-cssmin');
var sourcemaps  = require('gulp-sourcemaps');
var ngAnnotate  = require('gulp-ng-annotate');

//HTML Modules
var htmlmin     = require('gulp-htmlmin');
var rename      = require('gulp-rename');

//Sentry Integration
var sentryOpts = {
  DOMAIN: '',
  API_URL: '',
  API_KEY: '',
  debug: true ,
  versionPrefix: ''
};

//var sentryRelease = require('gulp-sentry-release')('./package.json', sentryOpts);

// --------------------------------------------------------------------
// Error Handler
// --------------------------------------------------------------------

//The title and icon that will be used for the gulp notifications
var onError = function(err) {
  console.log(err);
  /*ravenClient.captureMessage('Error with gulp build', {
    level: 'info',
    extra: {
      error: err
    }
  });*/
};

// --------------------------------------------------------------------
// Gulp config
// --------------------------------------------------------------------

var sourcePath = __dirname + '/client/src/';
var vendorPath = sourcePath + 'vendor/';

var bowerOptions = {
  paths: {
    bowerDirectory: vendorPath,
    bowerrc: __dirname + '/.bowerrc',
    bowerJson: __dirname + '/bower.json'
  },
  overrides: {
    'angular-ui-router-anim-in-out': {
      main: 'anim-in-out.js'
    }
  }
};

var config = {
  inject: {
    target: sourcePath + 'index.html',
    sources: {
      app: {
        css: [
          sourcePath + 'css/*.css',
          sourcePath + 'css/**/*.css',
          sourcePath + 'css/**/**/*.css',
          sourcePath + 'app/**/*.css',
          sourcePath + 'app/**/**/*.css'
        ],
        js: [
          sourcePath + 'app/*.js',
          sourcePath + 'app/**/*.js',
          sourcePath + 'app/**/**/*.js',
          sourcePath + 'app/**/**/**/*.js'
        ]
      }
    }
  },
  sass: {
    target: sourcePath + 'css',
    source: [
      sourcePath + 'css/scss/*.scss',
      sourcePath + 'css/*.scss',
      sourcePath + 'app/**/*.scss',
      sourcePath + 'app/**/**/*.scss',
      sourcePath + 'app/**/**/**/*.scss'
    ]
  }
};

// --------------------------------------------------------------------
// BUILD Options
// --------------------------------------------------------------------

var destPath  = __dirname + '/dist/';
var destIndex = destPath + 'index.html';
var buildDate = (new Date()).getTime();
var buildId = parseInt(buildDate/10000);
buildId = '' + buildId;
buildId = buildId.substring(2);
buildId = env.substring(0, 4) + '-' + buildId;

var build = {
  css: [
    sourcePath + 'css/*.css',
    sourcePath + 'css/**/*.css',
    sourcePath + 'css/**/**/*.css',
    sourcePath + 'app/**/*.css',
    sourcePath + 'app/**/**/*.css',
    sourcePath + 'app/**/**/**/*.css'
  ],
  js: [
    sourcePath + 'app/*.js',
    sourcePath + 'app/**/*.js',
    sourcePath + 'app/**/**/*.js',
    sourcePath + 'app/**/**/**/*.js',
    sourcePath + 'app/**/**/**/**/*.js'
  ],
  html: [
    sourcePath + 'app/**/*.html',
    sourcePath + 'app/**/**/*.html',
    sourcePath + 'app/**/**/**/*.html',
  ],
  images: [
    sourcePath + 'images/*.*',
    sourcePath + 'images/**/*.*',
    sourcePath + 'images/**/**/*.*'
  ],
  assets: [
    sourcePath + 'fonts/*.*',
    sourcePath + 'fonts/**/*.*',
    sourcePath + 'fonts/**/**/*.*'
  ]
};

var dest = {
  imagesPath: destPath + 'images/',
  assetsPath: destPath + 'fonts/',
  cssPath: destPath + 'css/',
  cssVendorFile: 'vendor.min.css',
  cssFile: 'app.min.css',
  jsPath: destPath + 'app/',
  jsVendorFile: 'vendor.min.js',
  jsFile: 'app.min.js',
  htmlPath: destPath + 'app',
  mapPath: destPath + 'maps/'
};

var htmlOpts = {
  collapseWhitespace: true
};

var jsOpts = {
  mangle: false,
  preserveComments: 'all'
};

var cacheOpts = {
  type: 'timestamp'
};

var buildJSOptions = JSON.parse(JSON.stringify(bowerOptions));

buildJSOptions.filter = /\.js$/i;

var bowerJS = bowerFiles(buildJSOptions);

var bowerCSS = bowerFiles({
    filter: /\.css$/i
});

// --------------------------------------------------------------------
// RELEASE Tasks
// --------------------------------------------------------------------

/*gulp.task('release', function() {
  if (env === 'development')
    return true;

  return gulp.start('release:raven');
});

gulp.task('release:raven', ['release:sources'], function(){
  
  var destPaths = [
    dest.jsPath  + '*.js',
    dest.mapPath + '*.*'
  ];

  if (process.env.DISABLE_RAVEN)
    return true;

  return gulp.src(destPaths, {base: destPath})
    .pipe(plumber(onError))
    .pipe(sentryRelease.release(buildId));
});

gulp.task('release:sources', function(){{
  var sourceFilePaths = [];

  if (process.env.DISABLE_RAVEN)
    return true;

  sourceFilePaths = sourceFilePaths.concat(bowerJS, config.inject.sources.app.js);

  return gulp.src(sourceFilePaths, {base: sourcePath})
    .pipe(plumber(onError))
    .pipe(sentryRelease.release(buildId));
}});*/

// --------------------------------------------------------------------
// BUILD Tasks
// --------------------------------------------------------------------

gulp.task('build', function() {
  if (env === 'development')
    return true;

  return gulp.start('build:inject');
});

gulp.task('build:inject', ['build:clean', 'move:index', 'build:js', 'build:css'], function(){
  return gulp.src(destIndex)
    .pipe(inject(
      gulp.src([dest.cssPath + 'app.min.*', dest.jsPath + 'app.min.*'], {read: false}),
      {relative: true}
    ))
    .pipe(inject(
      gulp.src([dest.cssPath + 'vendor.min.*', dest.jsPath + 'vendor.min.*'], {read: false}),
      {name: 'bower', relative: true}
    ))
    .pipe(gulp.dest(destPath));
});

gulp.task('build:clean', function() {
  return del([
    dest.cssPath + '*.css',
    dest.jsPath  + '*.js',
    dest.mapPath + '*.map'
  ]);
});

gulp.task('build:css', ['build:css:vendor', 'build:css:app']);

gulp.task('build:css:vendor', function(){
  return gulp.src(bowerCSS)
    .pipe(plumber(onError))
    .pipe(concat(dest.cssVendorFile))
    .pipe(cssmin())
    .pipe(rename(function (path) {
      path.basename += '.' + buildId;
    }))
    .pipe(gulp.dest(dest.cssPath));
});

gulp.task('build:css:app', function() {

  return gulp.src(config.sass.source)
    .pipe(plumber(onError))
    .pipe(sass(
      { includePaths: ['styles'].concat(neat) }
    ))
    .pipe(concat(dest.cssFile))
    .pipe(cssmin())
    .pipe(rename(function (path) {
      path.basename += '.' + buildId;
    }))
    .pipe(gulp.dest(dest.cssPath));
});

gulp.task('build:js', ['build:js:vendor', 'build:js:app']);

gulp.task('build:js:vendor', function() {

  var vendorJs = bowerJS.filter(function(file) {
    return file.indexOf('.js') > -1;
  });

  return gulp.src(vendorJs)
    .pipe(plumber(onError))
    .pipe(sourcemaps.init())
    .pipe(uglify())
    .pipe(concat(dest.jsVendorFile))
    .pipe(rename(function (path) {
      path.basename += '.' + buildId;
    }))
    .pipe(sourcemaps.write('../maps'))
    .pipe(gulp.dest(dest.jsPath));
});

gulp.task('build:js:app', ['build:js:lbservices'], function(){

  writeRavenReleaseFile(buildId);

  return gulp.src(build.js)
    .pipe(angularSort())
    .pipe(ngAnnotate())
    .pipe(plumber(onError))
    .pipe(sourcemaps.init())
    //.pipe(uglify(jsOpts))
    .pipe(concat(dest.jsFile))
    .pipe(rename(function (path) {
      path.basename += '.' + buildId;
    }))
    .pipe(sourcemaps.write('../maps'))
    .pipe(gulp.dest(dest.jsPath));
});

gulp.task('build:js:lbservices', function() {
  return gulp.src('./server/server.js')
    .pipe(loopback())
    .pipe(rename('lb-services.js'))
    .pipe(gulp.dest('./client/src/app/core')); 
});

gulp.task('move:index', ['move:angular', 'move:images', 'move:fonts'], function(){
  return gulp.src(config.inject.target)
    .pipe(gulp.dest(destPath));
});

gulp.task('move:images', function(){
  return gulp.src(build.images)
    .pipe(gulp.dest(dest.imagesPath));
});

gulp.task('move:fonts', function() {
  return gulp.src(build.assets)
    .pipe(gulp.dest(dest.assetsPath));
});

gulp.task('move:angular', function(){
  return gulp.src(build.html)
    .pipe(htmlmin(htmlOpts))
    .pipe(gulp.dest(dest.htmlPath));
});

// --------------------------------------------------------------------
// Development Tasks
// --------------------------------------------------------------------

//Default gulp task for dev purposes
gulp.task('default', ['watch', 'inject', 'sass', 'build:js:lbservices']);

//Injects all css/js files into our index.html src file
gulp.task('inject', function () {

  return gulp.src(config.inject.target)
    .pipe(plumber(onError))
    .pipe(inject(
      gulp.src(bowerFiles(bowerOptions), {read: false}),
      {name: 'bower', relative: true}
    ))
    .pipe(inject(
      es.merge(
        gulp.src(config.inject.sources.app.css),
        gulp.src(config.inject.sources.app.js).pipe(angularSort())
      ),
      {relative: true}
    ))
    .pipe(gulp.dest(sourcePath));
});

//Builds our sass with burbon/neat
gulp.task('sass', function() {
  return gulp.src(config.sass.source)
    .pipe(plumber(onError))
    .pipe(sass(
      { includePaths: ['styles'].concat(neat) }
    ))
    .pipe(gulp.dest(config.sass.target));
});

//Watches for changes in files that should be streamed/compiled to browser
gulp.task('watch', function() {

  livereload.listen();

  //We only want to inject files when files are added/deleted, not changed.
  var options = {events: ['add', 'unlink']};
  var injectFn = function() {
    return gulp.start('inject');
  };

  watch(
    config.sass.source,
    function(){
      return gulp.start('sass');
    }
  );

  //Watch for changes in app related JS files and live reload them
  watch(
    build.js,
    function(){
      return gulp.start('reload-js');
    }
  );

  // Watch for changes in html files and reload them
  watch(
    build.html,
    function(){
      return gulp.start('reload-html');
    }
  );

  // Watch for changes in html files and reload them
  watch(
    build.css,
    function(){
      return gulp.start('reload-css');
    }
  );


  //Watch for changes in app related files and inject new ones
  watch(
    config.inject.sources.app.js.concat(config.inject.sources.app.css),
    options,
    injectFn
  );

  //Watch for changes in bower related files and inject new ones
  watch(
    'bower.json',
    injectFn
  );
});

gulp.task('i', ['inject']);

gulp.task('reload-html', function(){
    return gulp.src(build.html)
    .pipe(plumber(onError))
    .pipe(changed(sourcePath + 'reload/'))
    .pipe(gulp.dest(sourcePath + 'reload/'))
    .pipe(livereload());
});

gulp.task('reload-js', function(){
    return gulp.src(build.js)
    .pipe(plumber(onError))
    .pipe(changed(sourcePath + 'reload/'))
    .pipe(gulp.dest(sourcePath + 'reload/'))
    .pipe(livereload());
});

gulp.task('reload-css', function(){
    return gulp.src(build.css)
    .pipe(plumber(onError))
    .pipe(changed(sourcePath + 'reload/', {hasChanged: changed.compareSha1Digest}))
    .pipe(gulp.dest(sourcePath + 'reload/'))
    .pipe(livereload());
});


function writeRavenReleaseFile(buildId) {

  if (process.env.DISABLE_RAVEN)
    return true;
  
  var ravenRelease = "angular.module('app.core').run(function(){ " +
    "'use strict'; Raven.setRelease('" + buildId + "'); });";

    ravenRelease = "Raven.config('" + 
      "" + 
      "').install();" + ravenRelease;
  

  return fs.writeFileSync(sourcePath + 'app/core/raven.release.js', ravenRelease);
}