import gulp from 'gulp'

export default {
  'src': [
    `${gulp.config('base.dist')}/assets/images/*.*`
  ],
  'dest': `${gulp.config('base.dist')}/assets/images`,
  'options': {
    progressive: true,
    svgoPlugins: [{removeViewBox: false}]
  }
}