import $ from 'jquery'

export default function (opts) {

  this.on('mount', ()=> {

    if (opts.auto_close) {
      setTimeout(()=> {
        $(this.root).fadeOut(500, ()=> {
          this.triggerClose(this)
        })
      }, 1500)
    }

    if (opts.type) {
      $(this.root).addClass(`alert-${opts.type}`)
    }

  })

  this.handleCloseClick = (evt)=> {
    evt.preventDefault()
    this.triggerClose(evt.item)
  }

  this.triggerClose = (item)=> {
    opts.on_close && opts.on_close(item)
  }
};