const gulp = require('gulp');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const cleanCSS = require('gulp-clean-css');
const inject = require('gulp-inject');
const browserSync = require('browser-sync').create();
const plumber = require('gulp-plumber');
const rename = require('gulp-rename');

let autoprefixer;
let del;

async function loadModules() {
  const [autoprefixerModule, delModule] = await Promise.all([
    import('gulp-autoprefixer'),
    import('del')
  ]);
  autoprefixer = autoprefixerModule.default;
  del = delModule.default;
}

const paths = {
  styles: {
    src: 'styles/**/*.css',
    dest: 'dist/css'
  },
  scripts: {
    src: 'scripts/**/*.js',
    dest: 'dist/js'
  },
  html: {
    src: 'index.html',
    dest: 'dist'
  },
  images: {
    src: 'images/**/*',
    dest: 'dist/images'
  }
};

// Очистка папки dist
async function clean() {
  await loadModules();
  return del(['dist']);
}

// Задача для минификации и конкатенации CSS
async function styles() {
  await loadModules();
  return gulp.src(['styles/styles.css', 'styles/responsive.css'])
    .pipe(plumber())
    .pipe(concat('styles.css'))
    .pipe(autoprefixer())
    .pipe(cleanCSS())
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest(paths.styles.dest))
    .pipe(browserSync.stream());
}

// Задача для минификации и конкатенации JS
async function scripts() {
  await loadModules();
  return gulp.src(paths.scripts.src)
    .pipe(plumber())
    .pipe(concat('scripts.js'))
    .pipe(uglify())
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest(paths.scripts.dest))
    .pipe(browserSync.stream());
}

// Задача для копирования HTML и добавления ссылок на скрипты и стили
async function html() {
  const sources = gulp.src(['dist/css/*.css', 'dist/js/*.js'], { read: false });
  await loadModules();
  return gulp.src(paths.html.src)
    .pipe(plumber())
    .pipe(gulp.dest(paths.html.dest))
    .pipe(inject(sources, { relative: true }))
    .pipe(gulp.dest(paths.html.dest))
    .pipe(browserSync.stream());
}

// Задача для копирования изображений
function images() {
  return gulp.src(paths.images.src)
    .pipe(plumber())
    .pipe(gulp.dest(paths.images.dest))
    .pipe(browserSync.stream());
}

// Задача для отслеживания изменений
function watch() {
  browserSync.init({
    server: {
      baseDir: './dist'
    }
  });
  gulp.watch(paths.styles.src, styles);
  gulp.watch(paths.scripts.src, scripts);
  gulp.watch(paths.html.src, html);
  gulp.watch(paths.images.src, images);
}

exports.clean = clean;
exports.styles = styles;
exports.scripts = scripts;
exports.html = html;
exports.images = images;
exports.watch = watch;

exports.default = gulp.series(clean, gulp.parallel(styles, scripts, images), html, watch);
