import $ from 'jquery'
import './../libs/lazyload'

export default function (opts = {}) {

  this.onCheckboxClick = (evt)=> {
    evt.stopPropagation()
    evt.item = this;
    opts.on_item_checkbox_click && opts.on_item_checkbox_click(evt)
  }

  this.on('mount', ()=> {
    if (opts.lazy_load) {
      setTimeout(()=> {
        $(this.root).find('img').lazyload()
      }, 200)
    }
  })

}
