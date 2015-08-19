import _ from 'lodash'

export default function (opts) {

  this.updateDataFromOpts = ()=> {
    this.margin = parseInt(opts.margin) || 3
    this.current = parseInt(opts.current) || 0
    this.total = parseInt(opts.total) || 1
    this.numberList = _.range(
      (this.current > this.margin) ? this.current - this.margin : 0,
      (this.total - this.current > this.margin) ? this.current + this.margin : this.total)
  }

  this.onItemClick = (evt)=> {
    this.emptyClick(evt)
    this.triggerItemClickEvent(evt.item.number)
  }

  this.onItemFirstClick = (evt)=> {
    this.emptyClick(evt)
    this.triggerItemClickEvent(0)
  }

  this.onItemLastClick = (evt)=> {
    this.emptyClick(evt)
    this.triggerItemClickEvent(this.total - 1)
  }

  this.onItemPrevClick = (evt)=> {
    this.emptyClick(evt)
    this.triggerItemClickEvent(this.current - 1)
  }

  this.onItemNextClick = (evt)=> {
    this.emptyClick(evt)
    this.triggerItemClickEvent(this.current + 1)
  }

  this.emptyClick = (evt)=> {
    evt.preventDefault()
  }

  this.triggerItemClickEvent = (nextNumber)=> {
    if (nextNumber >= 0 && nextNumber < this.total && nextNumber !== this.current) {
      opts.on_item_click && opts.on_item_click(nextNumber)
    }
  }

  // init

  this.updateDataFromOpts()
  this.on('update', ()=> {
    this.updateDataFromOpts()
  })

}