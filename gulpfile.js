var gulp = require('gulp');
var gutil = require("gulp-util");
var browserify = require('browserify');
var browserSync = require('browser-sync');
var filter = require('gulp-filter');
var sass = require('gulp-sass');
var source = require("vinyl-source-stream");
var sourcemaps = require("gulp-sourcemaps");
var reactify = require('reactify');
var watchify = require('watchify');
var autoprefixer = require('gulp-autoprefixer');

gulp.task('sync', function () {
  return browserSync({
    server: {
      baseDir: './'
    }
  });
});

gulp.task('js', function () {
  return browserifyShare();
});

function browserifyShare() {
  var b = browserify({
    entries: './index.js',
    transform: [reactify],
    cache: {},
    packageCache: {},
    fullPaths: true
  });

  b = watchify(b);
  b.on('update', function () {
    bundleShare(b);
  });

  //Kick off initial bundle
  return bundleShare(b);
}

function bundleShare(b) {
  console.log('Updating your JavaScripts!');

  return b.bundle()
    .on('error', function (err) {
      //Attempt to nicely print out compilation errors.
      if (err.message && err.filename) {
        gutil.log(gutil.colors.red('Error: ' + err.description + ' at '));
        gutil.log(gutil.colors.red('Error: ' + err.filename));
        gutil.log(gutil.colors.red('Error: on line ' + err.lineNumber + ' at column ' + err.column));
      } else {
        gutil.log(err);
      }
    })
    .pipe(source('main.js'))
    .pipe(gulp.dest('./dist'))
    .pipe(browserSync.reload({stream: true}));
}

gulp.task('css', function () {
  return gulp.src('./src/scss/main.scss')
    .pipe(sourcemaps.init())
    .pipe(sass({
      errLogToConsole: false,
      sourceComment: 'normal',
      onError: function (err) {
        console.log(err);
      }
    }))
    .pipe(autoprefixer({ cascade: false, browsers: ['last 2 versions']}))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('./dist'))
    .pipe(filter('**/*.css'))
    .pipe(browserSync.reload({stream: true}));
});

gulp.task('run', ['js', 'css', 'sync'], function () {
  gulp.watch('./src/scss/*.scss', ['css']);
});
