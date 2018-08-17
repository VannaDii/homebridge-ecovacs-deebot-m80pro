var gulp = require('gulp'),
  inlinesource = require('gulp-inline-source');

gulp.task('inline', function() {
  return gulp
    .src('./coverage/lcov-report/*.html')
    .pipe(
      inlinesource({
        attribute: false,
        rootpath: './coverage/lcov-report/',
      })
    )
    .pipe(gulp.dest('./coverage/lcov-report/'));
});
gulp.start('inline');
