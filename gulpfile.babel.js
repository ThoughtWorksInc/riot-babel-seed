import gulp from 'gulp'
import gutil from 'gulp-util'
import runSequence from 'run-sequence'
import path from 'path'
import requireDir from 'require-dir'
import gulpTaskConfig from './tasks/libs/gulp-task-config'

gulpTaskConfig(gulp)

requireDir('./tasks')

switch (gutil.env.target) {

  case 'admin':

    gulp.config('base.src', 'src-admin')
    gulp.config('base.dist', 'public/admin')

    gulp.config('tasks', requireDir('./tasks/config'))

    gulp.config('tasks.symlink', {
      src: `${gulp.config('base.dist')}/assets`,
      dest: path.join(process.cwd(), '../../target/classes/assets/js/running-event-assets')
    })

    gulp.task('build', (callback) => {
      runSequence(
        'clean',
        'copy',
        'stylus',
        'browserify',
        'symlink',
        callback
      )
    })

    break
  default:

    gulp.config('base.src', 'src-wechat')
    gulp.config('base.dist', 'public/wechat')

    gulp.config('tasks', requireDir('./tasks/config'))

    gulp.config('tasks.symlink', {
      src: `${gulp.config('base.dist')}/`,
      dest: path.join(process.cwd(), '../../target/classes/assets/campaign/events-gallery/build')
    })

    gulp.task('build', (callback) => {
      runSequence(
        'clean',
        'copy',
        'iconfont',
        'stylus',
        'browserify',
        'symlink',
        callback
      )
    })
}

gulp.task('dev', () => {
  gulp.config(gulp.DEV_MODE, true)
  gulp.start(['build', 'server'])
})

gulp.task('default', ['build'])
