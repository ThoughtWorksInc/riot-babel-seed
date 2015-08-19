import $ from 'jquery'
import '../../utils/bootstrap/modal'

import RunningEventActions from '../actions/RunningEventActions'

export default function (opts = {}) {

  this.setQrcode = (evt)=> {
    evt.preventDefault()
    RunningEventActions.setQrcode(opts.id)
      .then(()=> {
        RunningEventActions.listEvents()
      })
  }

  this.showModel = ()=> {
    this.$model.modal('show')
  }

  this.on('mount', ()=> {
    setTimeout(()=> {
      this.$model = $(this.root).find('.modal')
    })
  })


}