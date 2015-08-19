import runningEventApi from '../../apis/runningEvent'
import { createAction } from 'reflux'

import GalleryActions from './GalleryActions'

import MessageActions from '../../message/actions/MessageActions'

const asyncActionConfig = {
  asyncResult: true
}

const actions = {
  createEvent: createAction(asyncActionConfig),
  listEvents: createAction(asyncActionConfig),
  listEventCounts: createAction(asyncActionConfig),
  getEventInfo: createAction(asyncActionConfig),
  updateEvent: createAction(asyncActionConfig),
  cancelEvent: createAction(asyncActionConfig),
  sendRecap: createAction(asyncActionConfig),
  setQrcode: createAction(asyncActionConfig)
}

actions.createEvent.listen(function (data) {
  runningEventApi.createEvent(data)
    .then(this.completed)
    .then(MessageActions.log.bind(null, '创建成功', true))
    .catch((err)=> {
      MessageActions.alert(err.error)
      this.faild(err)
    })
})

actions.listEvents.listen(function (params = {}) {

  const RunningEventStore = require('../stores/RunningEventStore')

  params = {
    page: (params.page === undefined) ? RunningEventStore.page : params.page,
    category: params.category || RunningEventStore.category,
    size: RunningEventStore.size
  }

  runningEventApi.listEvents(params)
    .then(this.completed)
    .catch(this.faild)
})

actions.getEventInfo.listen(function (id) {
  runningEventApi.getEventInfo(id)
    .then((result)=> {
      this.completed(result)
      GalleryActions.getGalleryById(result.galleryId)
      return result
    })
    .catch(this.faild)
})

actions.updateEvent.listen(function (id, data) {
  runningEventApi.updateEvent(id, data)
    .then(this.completed)
    .then(MessageActions.log.bind(null, '保存成功', true))
    .catch((err)=> {
      MessageActions.alert(err.error)
      this.faild(err)
    })
})

actions.cancelEvent.listen(function (id, data) {
  runningEventApi.cancelEvent(id, data)
    .then(this.completed)
    .catch(this.failed)
})


actions.sendRecap.listen(function (id) {
  runningEventApi.sendRecap(id)
    .then(this.completed)
    .then(MessageActions.log.bind(null, '发送成功', true))
    .catch(this.failed)
})

actions.setQrcode.listen(function (id) {
  runningEventApi.setQrcode(id)
    .then(this.completed)
    .catch(this.failed)
})


export default actions;