import { createStore } from 'reflux';

import GalleryActions from '../actions/GalleryActions'
import UserStore from './UserStore'

export default createStore({

  init(){
    this.albumPhotoLengthMax = 9
    this.galleryMap = {}
    this.galleryList = []
    this.listenTo(GalleryActions.listGalleries.completed, 'onGalleryListUpdate')
    this.listenTo(GalleryActions.getGallery.completed, 'onGalleryUpdate')
  },

  onGalleryListUpdate(result){
    result.list.forEach((gallery)=> {
      this.galleryMap[gallery.id] = gallery
    })
    this.mapToList()
    this.trigger()
  },

  onGalleryUpdate(gallery){
    this.galleryMap[gallery.id] = gallery
    this.mapToList()
    this.trigger()
  },

  getGalleryById(galleryId){
    return this.galleryMap[galleryId]
  },

  mapToList(){
    this.galleryList = Object.values(this.galleryMap)
  },

  albumPhotosIndexOf (albumPhotos, photo) {
    let idx = -1
    let len = albumPhotos.length
    while (len--) {
      if (photo.id === albumPhotos[len].id) {
        idx = len
        break
      }
    }
    return idx
  },

  toggleSelectAlbumPhotoList(albumPhotos, photo){
    const index = this.albumPhotosIndexOf(albumPhotos, photo)
    if (index > -1) {
      photo.selected = false;
      albumPhotos.splice(index, 1)
    } else {
      photo.selected = true;
      albumPhotos.push(photo)
    }
    return albumPhotos;
  },

  getDisplayPhotos(gallery, userId){
    let photos = gallery.photos
    if (userId) {
      if (UserStore.isUserOwner(userId)) {
        photos = (photos || []).map((photoItem)=> {
          if (this.albumPhotosIndexOf(gallery.albumPhotos, photoItem) > -1) {
            photoItem.selected = true
          }
          return photoItem;
        })
      } else {
        photos = gallery.albumPhotos || [];
      }
    }
    return photos
  }

})