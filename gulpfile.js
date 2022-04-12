const { src, dest, watch, series } = require('gulp');
const pug = require('gulp-pug');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const babel = require('gulp-babel');
const terser = require('gulp-terser');
const browsersync = require('browser-sync').create();

const pugTask = () => {
  return src('./src/pages/*.pug')
    .pipe(
      pug({
        pretty: true,
      })
    )
    .pipe(dest('./public'));
}

const cssTask = () => {
  return src('./src/css/styles.css', { sourcemaps: true })
    .pipe(postcss([autoprefixer(), cssnano()]))
    .pipe(dest('./public/css', { sourcemaps: '.' }));
}

function jsTask() {
  return src('./src/js/script.js', { sourcemaps: true })
    .pipe(babel({ presets: ['@babel/preset-env'] }))
    .pipe(terser())
    .pipe(dest('./public/js', { sourcemaps: '.' }));
}


const browserSyncServe = (cb) => {
  browsersync.init({
    server: {
      baseDir: './public',
    },
    notify: {
      styles: {
        top: 'auto',
        bottom: '0',
      },
    },
  });
  cb();
}
const browserSyncReload = (cb) => {
  browsersync.reload();
  cb();
}

const watchTask = () =>  {
  watch('./public/*.html', browserSyncReload);
  watch(['./src/pages/*.pug', './src/partials/**/*.pug'], pugTask);
  watch(
    ['./src/css/**/*.css', './src/js/**/*.js'],
    series(cssTask, jsTask, browserSyncReload)
  );
}

exports.default = series(cssTask, jsTask, pugTask, browserSyncServe, watchTask);

exports.build = series(cssTask, jsTask, pugTask);
