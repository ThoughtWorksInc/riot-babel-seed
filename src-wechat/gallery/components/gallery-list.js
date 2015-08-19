import riot from 'riot'
import GalleryListStore from '../stores/GalleryListStore';

export default function (opts = {}) {

  this.params = riot.router.current.params
  this.gallery = {}
  this.photos = []
  this.albumPhotos = []


  this.toggleSelectPhoto = (evt)=> {
    this.albumPhotos = GalleryListStore.toggleSelectAlbumPhotoList(this.albumPhotos, evt.item.photoObj)
    this.update();
    this.triggerAlbumChange();
  };

  this.triggerAlbumChange = ()=> {
    opts.on_album_change && opts.on_album_change(this.albumPhotos);
  }

  this.moveToPreview = (evt)=> {
    //if (deviceHelper.isWechat()) {
    //  wechat.previewImage(evt.item.photoObj.regular, this.photos.map((item)=> {
    //    return item.regular
    //  }))
    //} else {
    const idx = evt.item.idx
    const userId = riot.router.current.params.userId
    riot.route(`${userId ? '/' + userId : ''}/gallery/${this.params.galleryId}/preview/?activeIdx=${idx}`)
    //}
  }

  this.on('update', ()=> {
    if (JSON.stringify(this.gallery) !== JSON.stringify(opts.gallery)) {
      this.gallery = opts.gallery
      this.albumPhotos = opts.gallery.albumPhotos
      this.photos = GalleryListStore.getDisplayPhotos(this.gallery, this.params.userId)
      this.update()
    }
  })
}
