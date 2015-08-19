import _ from 'lodash'
import { createStore } from 'reflux'

import runningEventActions from '../actions/RunningEventActions'
import GalleryActions from '../actions/GalleryActions'

const RunningEventStore = createStore({

  init(){
    this.eventItem = {}
    this.listenTo(runningEventActions.getEventInfo.completed, 'onGetEventInfoCompleted')
    this.listenTo(runningEventActions.updateEvent.completed, 'onUpdateEventCompleted')
    this.listenTo(runningEventActions.setQrcode.completed, 'onSetQrcodeCompleted')
    this.listenTo(GalleryActions.getGalleryById.completed, 'onGalleryByIdCompleted')
    this.listenTo(GalleryActions.removeGalleryImage.completed, 'onRemoveGalleryImageCompleted')
  },

  onUpdateEventCompleted(eventItem){
    this.eventItem = _.merge(this.eventItem, eventItem)
    this.trigger()
  },

  onSetQrcodeCompleted(qrCode){
    this.eventItem.qrCode = qrCode
    this.trigger()
  },

  onRemoveGalleryImageCompleted(gallery){
    this.eventItem.gallery = gallery
    this.trigger()
  },

  onGetEventInfoCompleted(eventItem){
    this.eventItem = eventItem
    this.trigger()
  },

  onGalleryByIdCompleted(gallery){
    this.eventItem.gallery = gallery
    this.trigger()
  }

})

export default RunningEventStore;