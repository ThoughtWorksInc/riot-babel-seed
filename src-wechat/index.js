import './polyfill/polyfill'
import riot from 'riot'
import wechat from './utils/wechat'
import router from './utils/router'

// notice long rule must first
riot.router.routes([
  ['/:userId/gallery/:galleryId/preview', require('./gallery/page-gallery-preview.tag.html')],
  ['/:userId/gallery/:galleryId/detail', require('./gallery/page-gallery-detail.tag.html')],
  ['/:userId/gallery/:galleryId', require('./gallery/page-gallery-cover.tag.html')],
  ['/:userId/gallery', require('./gallery/page-gallery.tag.html')],
  ['/gallery/:galleryId/preview', require('./gallery/page-gallery-preview.tag.html')],
  ['/gallery/:galleryId/detail', require('./gallery/page-gallery-detail.tag.html')],
  ['/gallery/:galleryId', require('./gallery/page-gallery-cover.tag.html')],
  ['/gallery', require('./gallery/page-gallery.tag.html'), {'default': true}]
])

riot.mount('#app', require('./app/app.tag.html'))

router.on('route:updated', ()=> {
  window.ga && window.ga('send', 'event', 'routeChanged', router.current.matches[router.current.matches.length - 1].tag)
})

wechat.tryResolveUrl()

wechat.ready()
  .then(()=> {
    riot.router.start()
  })
