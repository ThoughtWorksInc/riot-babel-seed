import riot from 'riot'
import reflux from 'reflux'

import RunningEventActions from './actions/RunningEventActions'
import RunningEventStore from './stores/RunningEventStore'

export default function (opts) {

  this.mixin(reflux.listenTo(RunningEventStore, 'onStoreUpdate'))

  this.onStoreUpdate = ()=> {
    this.getStateFromStore()
    this.update()
  }

  this.getStateFromStore = ()=> {
    this.list = RunningEventStore.list
    this.page = RunningEventStore.page
    this.category = RunningEventStore.category
    this.totalPages = RunningEventStore.totalPages
  }

  this.getStateFromRouter = ()=> {
    this.category = riot.router.current.params.category.toUpperCase()
  }

  this.handlePaginationItemClick = (nextNumber)=> {
    this.page = nextNumber
    this.fetchData()
  }

  this.fetchData = (isReset)=> {
    RunningEventActions.listEvents({
      category: this.category.toUpperCase(),
      page: isReset ? 0 : this.page
    })
  }

  this.isEventStateChanged = ()=> {
    return RunningEventStore.category !== riot.router.current.params.category.toUpperCase()
  }

  this.getStateFromStore()

  this.on('mount', ()=> {
    this.getStateFromRouter()
    if (this.isEventStateChanged()) {
      this.fetchData(true)
    }
    this.update()
  })

}