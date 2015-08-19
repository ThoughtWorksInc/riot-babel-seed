import gulp from 'gulp'

export default {
  'files': [
    {
      'src': [
        `${gulp.config('base.src')}/index.html`
      ],
      'dest': `${gulp.config('base.dist')}`,
      'options': {
        flatten: true
      }
    },
    {
      'src': [
        `${gulp.config('base.src')}/**/images/**/*.*`
      ],
      'dest': `${gulp.config('base.dist')}/assets/images`,
      'options': {
        'baseRegExp': /.+images/
      }
    }
  ]
}