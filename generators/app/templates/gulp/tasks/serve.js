var gulp = require('gulp');

gulp.task('serve', ['connect', 'watch'], function () {
  require('opn')('http://localhost:9000');
});

gulp.task('serve:dist', ['connect:dist'], function () {
  require('opn')('http://localhost:9000');
});
