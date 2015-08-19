import $ from 'jquery'
import riot from 'riot'
import Reflux from 'reflux'
import deviceHelper from '../utils/device-helper'

import GalleryActions from './actions/GalleryActions'
import GalleryListStore from './stores/GalleryListStore'

import UserStore from './stores/UserStore'

export default function () {

  this.mixin(Reflux.listenTo(GalleryListStore, 'onListStoreUpdate'))

  this.albumPhotoLengthMax = GalleryListStore.albumPhotoLengthMax

  this.onListStoreUpdate = ()=> {
    this.getStateFromStore()
    this.$banner && this.$banner.removeClass('hidden')
    this.update()
  }

  this.updatePageTitle = ()=> {
    global.document.title = `${this.gallery.typeText} ${this.activeIdx + 1}/${this.photos.length}`
  }

  this.activeIdx = riot.router.current.query.activeIdx || 0
  this.isWechat = deviceHelper.isWechat()

  this.onSlideEnd = (activeIdx, isInitial)=> {
    this.activeIdx = activeIdx
    if (this.isWechat && !isInitial) {
      this.$banner && this.$banner.addClass('hidden');
    }
    this.updatePageTitle()
    this.update()
  }

  this.onSlideEdge = (direction)=> {
    if (this.userId) {
      GalleryActions.getAlbumList(this.userId)
        .then((result)=> {
          const albumIdList = result.list.map(item=>item.id)
          const index = albumIdList.indexOf(this.gallery.id)
          let targetAlbumId = albumIdList[(direction === 'next') ? (index + 1) : (index - 1)];
          if (targetAlbumId) {
            try {
              global.location.replace(`#/${this.userId}/gallery/${targetAlbumId}/preview?activeIdx=${(direction === 'next') ? 0 : 'last'}`)
            } catch (err) {

            }
          } else {
            alert('已到最后一个专辑')
          }
        })
    }
  }

  this.toggleSelectPhoto = ()=> {
    this.albumPhotos = GalleryListStore.toggleSelectAlbumPhotoList(this.albumPhotos, this.photoList[this.activeIdx])
    this.update()
  };

  this.saveAlbum = (evt)=> {
    GalleryActions.updateAlbum({
      galleryId: this.gallery.id,
      galleryPhotoExtIds: (this.albumPhotos || []).map(albumPhoto => albumPhoto.id)
    }).then(()=> {
      riot.route(`/${this.userId}/gallery/${this.galleryId}/detail`)
    })
  }

  this.download = ()=> {
    const imageUrl = this.photoList[this.tags['gallery-slide'].activeIdx].original
    window.open(imageUrl, '_self')
  }

  this.getStateFromRouter = ()=> {
    const params = riot.router.current.params
    this.galleryId = params.galleryId
    this.userId = params.userId
  }

  this.getStateFromStore = ()=> {
    this.gallery = GalleryListStore.getGalleryById(this.galleryId) || {};
    this.albumPhotos = this.gallery.albumPhotos
    this.photoList = GalleryListStore.getDisplayPhotos(this.gallery, this.userId) || []
    this.photos = this.photoList.map(photoItem => photoItem.regular)
    this.updatePageTitle()
  }

  this.getStateFromRouter()
  this.getStateFromStore()

  this.editable = UserStore.isUserOwner(this.userId)

  this.on('mount', ()=> {
    this.$banner = $('.page-gallery-preview__banner');
  })

  this.on('mount update', ()=> {
    if (this.gallery.id !== this.galleryId) {
      GalleryActions.getGallery(this.galleryId, this.userId)
    }
  })

}
