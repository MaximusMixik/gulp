const gulp = require('gulp')

//! HTML
const fileInclude = require('gulp-file-include')
const fileIncludeSettings = {
  prefix: '@@',
  basepath: '@file'
}
// gulp-htmlclean Minimify html
const htmlclean = require('gulp-htmlclean')

// HTML-image to webp
const webpHTML = require('gulp-webp-html');


//!SCSS
const sass = require('gulp-sass')(require('sass'))
// sass-glob 
const sassGlob = require('gulp-sass-glob');
// autoprefixer
const autoprefixer = require('gulp-autoprefixer');
// src maps - для указания в коде в каком файле scss стили
const srcMaps = require('gulp-sourcemaps')
// mediaQueries - использовать уже для сборки
const groupMedia = require('gulp-group-css-media-queries')
// Minify CSS with CSSO
const csso = require('gulp-csso');
const webpCss = require('gulp-webp-css');


//! ошибки, валидация
const plumber = require('gulp-plumber')
const notify = require('gulp-notify')

const plumberNotify = (title) => {
  return {
    errorHandler: notify.onError({
      title: title,
      message: 'Error<%=error.message %>',
      sound: false
    })
  }
}

//! JS / Webpack  
const webpack = require('webpack-stream')
// babel /JS
const babel = require('gulp-babel')

//! IMG
// minimized IMG https://www.npmjs.com/package/imagemin
const imagemin = require('gulp-imagemin')
const webp = require('gulp-webp')

//changed - старые файлы без перезаписи https://www.npmjs.com/package/gulp-changed
const changed = require('gulp-changed')

// livereload
const server = require('gulp-server-livereload')
const serverSettings = {
  livereload: true, //reload
  open: true //open after comand
}
// Clean
const clean = require('gulp-clean')
const fs = require('fs') //установленій по умолчанию файловая система


//! Functions
// html
gulp.task('html:docs', function () {
  return gulp.src(['./src/html/**/*.html', '!./src/html/blocks/*.html'])
    .pipe(changed('./docs/'))
    .pipe(plumber(plumberNotify('HTML'))) //  ошибки, валидация
    .pipe(fileInclude(fileIncludeSettings))
    .pipe(webpHTML())
    .pipe(htmlclean())
    .pipe(gulp.dest('./docs/'))
})

// scss + src maps
gulp.task('sass:docs', function () {
  return gulp.src('./src/scss/*.scss')
    .pipe(changed('./docs/css/'))
    .pipe(plumber(plumberNotify('SCSS'))) //  ошибки, валидация
    .pipe(srcMaps.init()) // src maps
    .pipe(sassGlob())
    .pipe(groupMedia()) // использовать уже для сборки mediaQueries
    .pipe(sass())
    .pipe(webpCss())
    .pipe(autoprefixer())  //autoprefixer
    .pipe(csso())
    .pipe(srcMaps.write()) // src maps
    .pipe(gulp.dest('./docs/css/'))
})

// img 
gulp.task('images:docs', function () {
  return gulp.src('./src/img/**/*')
    .pipe(changed('./docs/img/')) //пропуск повторенного запроса на обработку
    .pipe(webp())
    .pipe(gulp.dest('./docs/img/'))
    .pipe(gulp.src('./src/img/**/*'))
    .pipe(changed('./docs/img/'))
    .pipe(imagemin({ verbose: true }))  //verbose: true показывает сколько файлов обработано и вес
    .pipe(gulp.dest('./docs/img/'))
})
// fonts
gulp.task('fonts:docs', function () {
  return gulp.src('./src/fonts/**/*')
    .pipe(changed('./docs/fonts/'))
    .pipe(gulp.dest('./docs/fonts/'))
})
// files
gulp.task('files:docs', function () {
  return gulp.src('./src/files/**/*')
    .pipe(changed('./docs/files/'))
    .pipe(gulp.dest('./docs/files/'))
})

//JS  Webpack / babel
gulp.task('js:docs', function () {
  return gulp.src('./src/js/*.js')
    .pipe(changed('./docs/js/'))
    .pipe(plumber(plumberNotify('JS'))) //  ошибки, валидация
    .pipe(babel())
    .pipe(webpack(require('./../webpack.config')))
    .pipe(gulp.dest('./docs/js'))

})

// livereload
gulp.task('server:docs', function () {
  return gulp.src('./docs/')
    .pipe(server(serverSettings))
})

// Clean docs 
gulp.task('clean:docs', function (done) {
  if (fs.existsSync('./docs/')) {  //проверка на существование папки docs
    return gulp.src('./docs/', { read: false })
      .pipe(clean({ force: true }))   //read: false -для ускорения    force: true - для удаления
  }
  done()
})

// watch
// gulp.task('watch:docs', function () {
//   gulp.watch('./src/scss/**/*.scss', gulp.parallel('sass:docs'))
//   gulp.watch('./src/**/*.html', gulp.parallel('html:docs'))
//   gulp.watch('./src/js/**/*.js', gulp.parallel('js:docs'))
//   gulp.watch('./src/img/**/*', gulp.parallel('images:docs'))
//   gulp.watch('./src/fonts/**/*', gulp.parallel('fonts:docs'))
//   gulp.watch('./src/files/**/*', gulp.parallel('files:docs'))
// })


