import riot from 'riot'

export default function (opts = {}) {

  const limited = 9

  this.covers = []

  this.photoItemClick = (evt)=> {
    const item = evt.item
    if (opts.gallery.albumPhotos && opts.gallery.albumPhotos.length) {
      riot.route(`/${this.userId}/gallery/${opts.gallery.id}/preview/?activeIdx=${item.idx}`)
    }
  }

  this.getStateFromRouter = ()=> {
    const params = riot.router.current.params
    this.userId = params.userId
  }

  this.getStateFromRouter()

  this.on('update', ()=> {

    if (opts.gallery.albumPhotos && opts.gallery.albumPhotos.length) {
      this.covers = opts.gallery.albumPhotos
    } else {
      this.covers = opts.gallery.covers || []
    }

    this.covers = this.covers
      .map((item)=> {
        return item.thumbnail
      })
      .filter((imageUrl, idx)=> {
        return idx < limited
      })

    this.update()

  })


}
