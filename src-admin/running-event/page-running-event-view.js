import riot from 'riot'
import reflux from 'reflux'

import RunningEventActions from './actions/RunningEventActions'
import RunningEventItemStore from './stores/RunningEventItemStore'

export default function (opts) {

  this.mixin(reflux.listenTo(RunningEventItemStore, 'onStoreUpdate'))

  this.eventItem = RunningEventItemStore.eventItem

  this.onStoreUpdate = ()=> {
    this.eventItem = RunningEventItemStore.eventItem
    this.update()
  }

  this.on('mount', ()=> {
    this.loading = true
    RunningEventActions
      .getEventInfo(riot.router.current.params.id)
      .then(()=> {
        this.loading = false
      })
  })

}