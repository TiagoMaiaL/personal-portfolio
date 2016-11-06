var gulp      = require('gulp'),
  concat      = require('gulp-concat'),
  rename      = require('gulp-rename'),
  cleanCss    = require('gulp-clean-css'),
  prefixer    = require('gulp-autoprefixer'),
  uglify      = require('gulp-uglify'),
  responsive  = require('gulp-responsive'),
  imagemin    = require('gulp-imagemin'),
  browserSync = require('browser-sync').create();

var templatesPath = './**/*.html'; 
  stylesPath      = 'resources/styles/*.css',
  jsPath          = 'js/*.js',
  imagesPath      = 'resources/images/*.{jpeg,gif,png}',
  imagesBuildPath = 'build/resources/images';


// TODO: include source maps.

gulp.task('styles', function() {
  gulp.src(stylesPath)
    .pipe(concat('styles.all.css'))
    .pipe(prefixer({
      browsers: ['last 2 versions'],
      cascade: false
    }))
    .pipe(cleanCss())
    .pipe(rename('main.min.css'))
    .pipe(gulp.dest('build/styles'))
    .pipe(browserSync.stream());
});

gulp.task('scripts', function() {
  gulp.src(jsPath)
    .pipe(concat('js.all.css'))
    .pipe(uglify())
    .pipe(rename('main.min.js'))
    .pipe(gulp.dest('build/js'));
});

gulp.task('scripts-watch', ['scripts'], function() {
  browserSync.reload();
  done();
});

gulp.task('images', function() {
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
    .pipe(gulp.src(imagesBuildPath));
});

gulp.task('browser-sync', function() {
  browserSync.init({
    server: {
      baseDir: './'
    }
  });
});

gulp.task('serve', ['browser-sync', 'styles'], function() {
  gulp.watch(stylesPath, ['styles']);
  gulp.watch(jsPath, ['scripts-watch']);
  gulp.watch(templatesPath).on('change', browserSync.reload);
});
