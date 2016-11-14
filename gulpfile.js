var gulp      = require('gulp'),
  concat      = require('gulp-concat'),
  rename      = require('gulp-rename'),
  cleanCss    = require('gulp-clean-css'),
  prefixer    = require('gulp-autoprefixer'),
  uglify      = require('gulp-uglify'),
  responsive  = require('gulp-responsive'),
  bower       = require('gulp-main-bower-files'),
  filter      = require('gulp-filter'),
  browserSync = require('browser-sync').create();

// TODO: include source maps.

var templatesPath = './**/*.html'; 
  stylesPath      = './resources/styles/*.css',
  jsPath          = './js/*.js',
  imagesPath      = './resources/images/*.{jpg,gif,png}',
  imagesBuildPath = './build/resources/images',
  bowerPath       = './bower_components/**/*';

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

  var getConfigurations = function(options) {
    return options.map(function(option) {
      return {
        name: '*',
        width: option.width,
        rename: {
          suffix: option.suffix
        },
        grayscale: 1
      }
    });
  }

  gulp.src(imagesPath)
    .pipe(responsive(getConfigurations([{
        width: 480,
        suffix: '-small'
      }, {
        width: 960,
        suffix: '-small-2x'
      }, {
        width: 700,
        suffix: '-medium'
      }, {
        width: 1400,
        suffix: '-medium-2x'
      }, {
        width: 1024,
        suffix: '-large'
      }, {
        width: 2048,
        suffix: '-large-2x'
      }]), {
        quality: 70,
        progressive: true,
        compressionLevel: 6,
        withMetaData: false
      }))
    .pipe(gulp.dest(imagesBuildPath));
});

gulp.task('bower', function() {
  var jsFilter  = filter(['**/*.js'], {restore: true}),
    cssFilter   = filter(['**/*.css'], {restore: true});

  return gulp.src('./bower.json')
    .pipe(bower())

    .pipe(jsFilter)
    .pipe(concat('vendor.js'))
    .pipe(uglify())
    .pipe(rename('vendor.min.js'))
    .pipe(gulp.dest('build/js/vendor'))
    .pipe(jsFilter.restore)

    .pipe(cssFilter)
    .pipe(concat('vendor.css'))
    .pipe(cleanCss())
    .pipe(rename('vendor.min.css'))
    .pipe(gulp.dest('build/styles/vendor'))
    .pipe(cssFilter.restore);
    // TODO: Build the fonts as well.
});

gulp.task('bower-watch', ['bower'], function() {
  browserSync.reload();
  done();
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
  gulp.watch(bowerPath, ['bower-watch']);
  gulp.watch(templatesPath).on('change', browserSync.reload);
});
