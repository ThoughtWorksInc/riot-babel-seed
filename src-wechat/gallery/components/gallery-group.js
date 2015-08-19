import riot from 'riot'
import UserStore from '../stores/UserStore'
import DayFormats from '../constants/DayFormats'
import MonthFormats from '../constants/MonthFormats'

export default function (opts) {

  this.getStateFromOpts = ()=> {
    this.when = new Date(opts.gallery.when)
    this.day = DayFormats[this.when.getDay()]
    this.date = MonthFormats[this.when.getMonth()] + this.when.getDate() + '日'
  }

  this.getStateFromOpts()

  this.handleSeeMoreClick = function () {
    const userId = riot.router.current.params.userId
    if (opts.gallery.albumPhotos && opts.gallery.albumPhotos.length && !UserStore.isUserOwner(userId)) {
      riot.route(`/${userId}/gallery/${opts.gallery.id}/detail`)
    } else {
      riot.route(`/gallery/${opts.gallery.id}/detail`)
    }
  }

  this.on('update', ()=> {
    this.getStateFromOpts()
    this.update()
  })

}