import GalleryActions from '../actions/GalleryActions'

export default function (opts = {}) {

  this.images = []

  this.removeImage = (evt)=> {
    GalleryActions.removeGalleryImage(opts.gallery.id, opts.type, evt.item.imageItem.id)
  }

  this.on('update', ()=> {
    this.images = (opts.gallery || {})[opts.type + 's']
    this.update()
  })

}