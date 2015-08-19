import gulp from 'gulp'
import gulpImagemin from 'gulp-imagemin'

const TASK_NAME = 'imagemin'

function imageminOnce(fileConf) {
  return gulp.src(fileConf.src)
    .pipe(gulpImagemin(fileConf.options))
    .pipe(gulp.dest(fileConf.dest))
}

function imagemin() {
  return gulp.autoRegister(TASK_NAME, imageminOnce)
}

export default gulp.task(TASK_NAME, imagemin)
