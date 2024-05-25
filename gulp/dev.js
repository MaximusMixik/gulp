const gulp = require('gulp')
// html
const fileInclude = require('gulp-file-include')
const fileIncludeSettings = {
  prefix: '@@',
  basepath: '@file'
}
// scss
const sass = require('gulp-sass')(require('sass'))
// sass-glob 
const sassGlob = require('gulp-sass-glob');
// src maps
const srcMaps = require('gulp-sourcemaps')
// ошибки, валидация
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

// Webpack / JS
const webpack = require('webpack-stream')
// babel /JS
const babel = require('gulp-babel')
// minimized IMG https://www.npmjs.com/package/imagemin
const imagemin = require('gulp-imagemin')
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

// html
gulp.task('html:dev', function () {
  return gulp.src(['./src/html/**/*.html', '!./src/html/blocks/*.html'])
    .pipe(changed('./build/', { hasChanged: changed.compareContents }))
    .pipe(plumber(plumberNotify('HTML'))) //  ошибки, валидация
    .pipe(fileInclude(fileIncludeSettings))
    .pipe(gulp.dest('./build/'))
})

// scss + src maps
gulp.task('sass:dev', function () {
  return gulp.src('./src/scss/*.scss')
    .pipe(changed('./build/css/'))
    .pipe(plumber(plumberNotify('SCSS'))) //  ошибки, валидация
    .pipe(srcMaps.init()) // src maps
    .pipe(sassGlob())
    .pipe(sass())
    .pipe(srcMaps.write()) // src maps
    .pipe(gulp.dest('./build/css/'))
})

// img 
gulp.task('images:dev', function () {
  return gulp.src('./src/img/**/*')
    .pipe(changed('./build/img/')) //пропуск повторенного запроса на обработку
    // .pipe(imagemin({ verbose: true }))   //для скорости разработки в dev  можно отключить    verbose: true показывает сколько файлов обработано и вес
    .pipe(gulp.dest('./build/img/'))
})
// fonts
gulp.task('fonts:dev', function () {
  return gulp.src('./src/fonts/**/*')
    .pipe(changed('./build/fonts/'))
    .pipe(gulp.dest('./build/fonts/'))
})
// files
gulp.task('files:dev', function () {
  return gulp.src('./src/files/**/*')
    .pipe(changed('./build/files/'))
    .pipe(gulp.dest('./build/files/'))
})

//JS  Webpack / babel
gulp.task('js:dev', function () {
  return gulp.src('./src/js/*.js')
    .pipe(changed('./build/js/'))
    .pipe(plumber(plumberNotify('JS'))) //  ошибки, валидация
    // .pipe(babel())   //для скорости разработки в dev можно отключить 
    .pipe(webpack(require('./../webpack.config')))
    .pipe(gulp.dest('./build/js'))

})

// livereload
gulp.task('server:dev', function () {
  return gulp.src('./build/')
    .pipe(server(serverSettings))
})

// Clean build 
gulp.task('clean:dev', function (done) {
  if (fs.existsSync('./build/')) {  //проверка на существование папки build
    return gulp.src('./build/', { read: false })
      .pipe(clean({ force: true }))   //read: false -для ускорения    force: true - для удаления
  }
  done()
})

// watch
gulp.task('watch:dev', function () {
  gulp.watch('./src/scss/**/*.scss', gulp.parallel('sass:dev'))
  gulp.watch('./src/**/*.html', gulp.parallel('html:dev'))
  gulp.watch('./src/js/**/*.js', gulp.parallel('js:dev'))
  gulp.watch('./src/img/**/*', gulp.parallel('images:dev'))
  gulp.watch('./src/fonts/**/*', gulp.parallel('fonts:dev'))
  gulp.watch('./src/files/**/*', gulp.parallel('files:dev'))
})


