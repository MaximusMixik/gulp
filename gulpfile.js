// const gulp = require('gulp')
// const less = require('less')
// const del = require('del')


// function clean() {
//   return del(['dist'])
// }

// exports.clean = clean

// Видео 2
const gulp = require('gulp')
require('./gulp/dev.js')
require('./gulp/docs.js')


// default
gulp.task('default', gulp.series(
  'clean:dev',
  gulp.parallel('html:dev', 'sass:dev', 'images:dev', 'js:dev', 'fonts:dev', 'files:dev'),
  gulp.parallel('server:dev', 'watch:dev')
))

// docs    to run =  gulp docs
gulp.task('docs', gulp.series(
  'clean:docs',
  gulp.parallel('html:docs', 'sass:docs', 'images:docs', 'js:docs', 'fonts:docs', 'files:docs'),
  gulp.parallel('server:docs') //, 'watch:docs'
))


