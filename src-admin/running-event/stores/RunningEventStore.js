import { createStore } from 'reflux'

import RunningEventActions from '../actions/RunningEventActions'

const RunningEventStore = createStore({

  init(){
    this.list = []
    this.page = 0
    this.size = 5
    this.category = ''
    this.counts = {}
    this.totalPages = 1
    this.listenTo(RunningEventActions.listEvents.completed, 'onListEventsCompleted')
    this.listenTo(RunningEventActions.listEventCounts.completed, 'onListEventCountsCompleted')
  },

  onListEventsCompleted(result){
    this.list = result.list
    this.category = result.category
    this.counts = result.counts
    this.page = result.page; // index of page
    this.size = result.size
    this.totalPages = result.totalPages
    this.trigger()
  }

})

export default RunningEventStore;