import Reflux from 'reflux'

import MessageStore from './stores/MessageStore'
import MessageActions from './actions/MessageActions'

export default function () {

  this.mixin(Reflux.listenTo(MessageStore, 'onMessageUpdate'))

  this.onMessageUpdate = ()=> {
    this.getStateFromStore()
    this.update()
  }

  this.handleMessageClose = (item)=> {
    MessageActions.close(item.idx)
  }

  this.getStateFromStore = ()=> {
    this.messageList = MessageStore.getMessageList()
  }

  this.getStateFromStore()

}