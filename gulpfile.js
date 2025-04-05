const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const browserSync = require('browser-sync').create();
const cleanCSS = require('gulp-clean-css');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const webpack = require('webpack-stream');
const webpackConfig = require('./webpack.config.js');
const webpackDevConfig = require('./webpack.dev.config.js');

const srcPath = './src';
const distPath = './dist';

function html() {
  return gulp.src(`${srcPath}/*.html`).pipe(gulp.dest(distPath));
}

function fonts() {
  return gulp
    .src(`${srcPath}/fonts/**/*`, { encoding: false })
    .pipe(gulp.dest(`${distPath}/fonts`));
}

function img() {
  return gulp
    .src(`${srcPath}/img/*.*`, { encoding: false })
    .pipe(gulp.dest(`${distPath}/img`));
}

function copyJs() {
  return gulp.src(`${srcPath}/js/**/*`).pipe(gulp.dest(`${distPath}/js`));
}

function locales() {
  return gulp
    .src(`${srcPath}/locales/**/*.json`)
    .pipe(gulp.dest(`${distPath}/locales`));
}

async function style() {
  const autoprefixer = (await import('gulp-autoprefixer')).default;
  return gulp
    .src(`${srcPath}/scss/style.scss`)
    .pipe(sass().on('error', sass.logError))
    .pipe(
      autoprefixer({
        cascade: false,
      })
    )
    .pipe(gulp.dest(`${distPath}/css`))
    .pipe(browserSync.stream());
}

function webpackTask(config) {
  return gulp
    .src(`${srcPath}/js/index.js`)
    .pipe(webpack(config))
    .pipe(gulp.dest(`${distPath}/js`))
    .pipe(browserSync.stream());
}

// Задачи для development
function serve(cb) {
  browserSync.init({
    server: {
      baseDir: distPath,
    },
  });
  cb();
}

function reload(cb) {
  browserSync.reload();
  cb();
}

function watch() {
  gulp.watch(`${srcPath}/scss/**/*.scss`, style);
  gulp.watch(`${srcPath}/*.html`, gulp.series(html, reload));
  gulp.watch(`${srcPath}/js/**/*.js`, devWebpack);
  gulp.watch(`${srcPath}/fonts/**/*`, fonts);
  gulp.watch(`${srcPath}/img/**/*`, img);
  gulp.watch(`${srcPath}/locales/**/*.json`, locales);
}

function devWebpack() {
  return webpackTask(webpackDevConfig); // Используем webpackDevConfig для development
}

const development = gulp.series(
  html,
  fonts,
  img,
  style,
  locales,
  devWebpack,
  serve,
  watch
);

// Задачи для production
async function prodStyle() {
  const autoprefixer = (await import('gulp-autoprefixer')).default;
  return gulp
    .src(`${srcPath}/scss/style.scss`)
    .pipe(sass().on('error', sass.logError))
    .pipe(
      autoprefixer({
        cascade: false,
      })
    )
    .pipe(cleanCSS({ compatibility: 'ie8' }))
    .pipe(gulp.dest(`${distPath}/css`));
}

function prodWebpack() {
  return webpackTask(webpackConfig);
}

const build = gulp.series(html, fonts, img, prodStyle, locales, prodWebpack);

exports.start = development;
exports.build = build;

exports.style = style;
exports.server = serve;
exports.watch = watch;
exports.js = devWebpack;
exports.html = html;
exports.fonts = fonts;
exports.img = img;
exports.locales = locales;
exports.default = development;
