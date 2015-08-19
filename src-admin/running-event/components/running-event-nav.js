import riot from 'riot'
import reflux from 'reflux'

import RunningEventCategory from '../constants/RunningEventCategory'
import RunningEventStore from '../stores/RunningEventStore'

export default function () {

  this.mixin(reflux.listenTo(RunningEventStore, 'onStoreUpdate'))

  this.category = ''
  this.counts = {}

  this.onStoreUpdate = ()=> {
    this.counts = RunningEventStore.counts
    this.update()
  }

  this.runningEventList = Object.keys(RunningEventCategory).map((categoryKey)=> {
    return {
      label: RunningEventCategory[categoryKey],
      value: categoryKey
    }
  })

  this.transitionTo = (evt)=> {
    riot.route(`/category/${String(evt.item.runningEvent.value).toLowerCase()}`)
  }

  this.on('mount', ()=> {
    setTimeout(()=> {
      this.updateStatus()
      this.update()
    })
  })

  riot.router.on('route:updated', ()=> {
    this.updateStatus()
  })

  this.updateStatus = ()=> {
    this.category = String(riot.router.current.params.category).toUpperCase()
  }

}