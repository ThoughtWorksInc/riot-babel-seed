import riot from 'riot'
import moment from 'moment'
import RunningEventTypes from '../constants/RunningEventTypes'

export default function () {

  this.moment = moment
  this.RunningEventTypes = RunningEventTypes

  this.handleClick = (evt)=> {
    riot.route(`/category/${this.category}/view/${String(evt.item.item.id)}`)
  }

  this.getStateFromRouter = ()=> {
    this.activeId = riot.router.current.params.id
    this.category = riot.router.current.params.category
  }

  this.getStateFromRouter()

  riot.router.on('route:updated', ()=> {
    this.getStateFromRouter()
    this.update()
  })
}