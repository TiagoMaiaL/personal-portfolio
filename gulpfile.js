var gulp      = require('gulp'),
  concat      = require('gulp-concat'),
  rename      = require('gulp-rename'),
  cleanCss    = require('gulp-clean-css'),
  prefixer    = require('gulp-autoprefixer'),
  uglify      = require('gulp-uglify'),
  responsive  = require('gulp-responsive'),
  bower       = require('gulp-main-bower-files'),
  filter      = require('gulp-filter'),
  flatten     = require('gulp-flatten'),
  replace     = require('gulp-replace'),
  browserSync = require('browser-sync').create();

// TODO: include source maps.
// TODO: Use promises instead of timeouts.

var templatesPath = './**/*.html';
  stylesPath      = './resources/styles/*.css',
  fontelloPath    = './resources/fonts/fontello/css/fontello.css',
  jsPath          = './resources/js/*.js',
  imagesPath      = './resources/images/*.{jpg,gif,png}',
  imagesBuildPath = './build/resources/images',
  bowerPath       = './bower_components/**/*';

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

gulp.task('bower-scripts', function() {
  var jsGlob    = '**/*.js',
      jsFilter  = filter([jsGlob], {restore: true});

  gulp.src('./bower.json')
    .pipe(bower(jsGlob, {
      overrides: {
        jquery: {
          main: [
            'dist/jquery.min.js'
          ]
        },
        masonry: {
          main: [
            'dist/masonry.pkgd.min.js'
          ],
          ignore: false
        },
        outlayer: {
          ignore: true
        }
      }
    }))
    .pipe(jsFilter)
    .pipe(concat('vendor.js'))
    .pipe(uglify())
    .pipe(rename('vendor.min.js'))
    .pipe(jsFilter.restore)
    .pipe(gulp.dest('build/js/vendor'))
});

gulp.task('styles', function() {
  return gulp.src(stylesPath)
    .pipe(concat('main.css'))
    .pipe(prefixer({
      browsers: ['last 2 versions'],
      cascade: false
    }))
    .on('error', console.log.bind(console))
    .pipe(cleanCss())
    .pipe(rename('main.min.css'))
    .pipe(gulp.dest('build/styles'))
    .pipe(browserSync.stream());
});

gulp.task('bower-styles', function() {
  var cssGlob   = '**/*.css',
      cssFilter = filter([cssGlob], {restore: true});

  gulp.src('./bower.json')
    .pipe(bower(cssGlob))
    .pipe(cssFilter)
    .pipe(concat('vendor.css'))
    .pipe(cleanCss())
    .on('error', console.log.bind(console))
    .pipe(rename('vendor.min.css'))
    .pipe(cssFilter.restore)
    .pipe(gulp.dest('build/styles'));

  setTimeout(function() {
    gulp.src([fontelloPath, 'build/styles/vendor.min.css'])
      .pipe(concat('vendor.css'))
      .pipe(cleanCss())
      .on('error', console.log.bind(console))
      .pipe(rename('vendor.min.css'))
      .pipe(gulp.dest('build/styles'));
  }, 2000);
});

gulp.task('styles-all', ['styles', 'bower-styles', 'fonts'], function() {
  setTimeout(function() {
    gulp.src('build/styles/vendor.min.css')
      .pipe(replace('fonts/', '../fonts/'))
      .pipe(replace('../font/', '../fonts/'))
      .pipe(gulp.dest('build/styles'));
  }, 2500);
});

gulp.task('fonts', function() {
  var bowerFontsGlob  = 'bower_components/**/fonts/*.{eot,svg,ttf,woff,woff2}',
      vendorFontsGlob = 'resources/fonts/**/*.{eot,svg,ttf,woff,woff2}';

  gulp.src(bowerFontsGlob)
    .pipe(flatten())
    .pipe(gulp.dest('build/fonts'));

  gulp.src(vendorFontsGlob)
    .pipe(flatten())
    .pipe(gulp.dest('build/fonts'));
});

gulp.task('bower-watch', ['bower-scripts', 'styles-all'], function(done) {
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
