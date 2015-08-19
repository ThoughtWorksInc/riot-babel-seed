import gulp from 'gulp'

export default {
  src: `${gulp.config('base.src')}/components/svgs/*.svg`,
  dest: `${gulp.config('base.dist')}/assets/fonts`,
  destCssSrc: `${gulp.config('base.src')}/components/styles/__generated/`,
  options: {
    'fontName': 'iconfont',
    'normalize': true,
    'fixedWidth': true,
    'fontHeight': 576,
    'descent': 576 / 12 * 2,
    'centerHorizontally': true,
    'fontShortName': 'icon',
    'bem': true
  }
}