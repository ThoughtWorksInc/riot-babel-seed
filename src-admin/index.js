import './polyfill/polyfill'
import riot from 'riot'
import './utils/riot-router'
import updateMeta from './utils/updateMeta'

riot.router.routes([
  ['/category/:category', require('./running-event/page-running-event.tag.html'), {
    'default': {
      params: {
        category: 'upcoming'
      }
    },
    'child': [
      ['/view/:id', require('./running-event/page-running-event-view.tag.html')]
    ]
  }],
  ['/create', require('./running-event/page-running-event-create.tag.html')]
])

updateMeta()
  .then(()=> {
    riot.mount('#app', require('./app/app.tag.html'))
    riot.router.start()
  })
