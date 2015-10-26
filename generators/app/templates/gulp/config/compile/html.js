var gulp = require('gulp');
var $ = require('gulp-load-plugins')();

gulp.task('html', ['styles', 'fonts'], function () {
  var lazypipe = require('lazypipe');
  var cssChannel = lazypipe()
    .pipe($.csso);

  var assets = $.useref.assets({searchPath: '{.tmp,app,.}'}); // search .tmp, app and ./bower_components for all referenced files

  gulp.src(['.tmp/fonts/**/*'])
    .pipe(gulp.dest('dist/fonts'));

  return gulp.src(['app/**/*.html'])
    .pipe(assets)
    .pipe($.if('*.js', $.uglify()))
    .pipe($.if('*.css', cssChannel()))
    .pipe(assets.restore())
    .pipe($.useref())
    .pipe($.if('*.html', $.minifyHtml({conditionals: true, loose: true})))
    .pipe(gulp.dest('dist'));
});