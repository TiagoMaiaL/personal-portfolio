var gulp = require('gulp'),
  concat = require('gulp-concat'),
  rename = require('gulp-rename'),
  cleanCss = require('gulp-clean-css'),
  prefixer = require('gulp-autoprefixer'),
  uglify = require('gulp-uglify'),
  resize = require('gulp-image-resize');

// TODO: include source maps.

gulp.task('styles', function() {
  gulp.src('resources/styles/*.css')
    .pipe(concat())
    .pipe(prefixer({
      browsers: ['last 2 versions'],
      cascade: false
    }))
    .pipe(cleanCss())
    .pipe(rename('main.min.css'))
    .pipe(gulp.dest('build/'));
});

gulp.task('scripts', function() {
  gulp.src('js/*.js')
    .pipe(concat())
    .pipe(uglify())
    .pipe(rename('main.min.js'))
    .pipe(gulp.dest('build/'));
});

gulp.task('images', function() {});
