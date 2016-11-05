var gulp      = require('gulp'),
  concat      = require('gulp-concat'),
  rename      = require('gulp-rename'),
  cleanCss    = require('gulp-clean-css'),
  prefixer    = require('gulp-autoprefixer'),
  uglify      = require('gulp-uglify'),
  responsive  = require('gulp-responsive'),
  imagemin    = require('gulp-imagemin');

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

gulp.task('images', function() {
  var imagesPath = 'resources/images/*.{jpeg,gif,png}';
  var buildPath = 'build/resources/images';

  gulp.src(imagesPath)
    .pipe(responsive([
      {
        width: 480,
        rename: {
          suffix: '480-small'
        }
      }, {
        width: 700,
        rename: {
          suffix: '700-medium'
        }
      }, {
        width: 1024,
        rename: {
          suffix: '1024-large'
        }
      }
      ], {
        quality: 70,
        progressive: true,
        compressionLevel: 6,
        withMetaData: false
      }))
    .pipe(imagemin())
    .pipe(gulp.src(buildPath));
});

gulp.task('images', function() {});
