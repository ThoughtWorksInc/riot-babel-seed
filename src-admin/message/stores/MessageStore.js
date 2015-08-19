import { createStore } from 'reflux'

import MesseageActions from '../actions/MessageActions'

const messageList = []

export default createStore({

  init(){
    this.listenTo(MesseageActions.log, 'onLog')
    this.listenTo(MesseageActions.alert, 'onAlert')
    this.listenTo(MesseageActions.close, 'onClose')
  },

  onLog(string = '', autoClose = false){
    this.addMessage('success', string, autoClose)
  },

  onAlert(string = '', autoClose = false){
    this.addMessage('danger', string, autoClose)
  },

  onClose(idx){
    if (idx > -1 && idx < messageList.length) {
      messageList.splice(idx, 1)
      this.trigger()
    }
  },

  addMessage(type, message, autoClose){
    messageList.push({
      type: type,
      message: message,
      autoClose: message
    })
    this.trigger();
  },

  getMessageList(){
    return messageList;
  }
})