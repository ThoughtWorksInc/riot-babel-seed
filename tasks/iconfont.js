import _ from 'lodash'
import path from 'path'
import gulp from 'gulp'
import rename from 'gulp-rename'
import svg2ttf from 'gulp-svg2ttf'
import ttf2eot from 'gulp-ttf2eot'
import ttf2woff from 'gulp-ttf2woff'
import ttf2woff2 from 'gulp-ttf2woff2'
import svgicons2svgfont from 'gulp-svgicons2svgfont'
import syncProcessor from 'gulp-sync-processor'
import gulpSvgIgnore from 'gulp-svg-ignore'
import md5 from 'md5'
import mapStream from 'map-stream'

const TASK_NAME = 'iconfont'

function iconfontOnce(conf) {

  const tplData = {
    fontConfig: _.merge({}, conf.options)
  }

  return gulp.src(conf.src)
    .pipe(gulpSvgIgnore(['#gridlines', '#grids']))
    .pipe(svgicons2svgfont(conf.options))
    .on('glyphs', (glyphs)=> {
      tplData.glyphs = glyphs.map((glyph)=> {
        glyph.codePoint = glyph.unicode[0].charCodeAt(0).toString(16).toUpperCase()
        return glyph
      })
    })
    .pipe(mapStream((file, callback)=> {
      tplData.fontConfig.hash = md5(String(file.contents))
      callback(null, file)
    }))
    .pipe(svg2ttf())
    .pipe(ttf2eot({clone: true}))
    .pipe(ttf2woff({clone: true}))
    .pipe(ttf2woff2({clone: true}))
    .pipe(syncProcessor({
      options: {
        data: tplData,
        isProcess: function (data) {
          return data.glyphs.length > 0
        }
      },
      files: [
        {src: path.join(__dirname, 'tpls/global-icons.styl.ejs')},
        {src: path.join(__dirname, 'tpls/util-icons.styl.ejs')}
      ]
    }))
    .pipe(rename(function (pathObj) {
      switch (pathObj.extname) {
        case '.styl':
          pathObj.dirname = conf.destCssSrc
          break
        default:
          pathObj.dirname = conf.dest
      }
    }))
    .pipe(gulp.dest(process.cwd()))
    .pipe(gulp.pipeTimer(TASK_NAME))
}

function iconfont() {
  return gulp.autoRegister(TASK_NAME, iconfontOnce, (config)=> {
    gulp.watch(config.src, ()=> {
      iconfontOnce(config)
    })
  })
}

gulp.task(TASK_NAME, iconfont)

export default iconfont
