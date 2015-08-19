import galleryApi from '../../apis/gallery'
import runnerApi from '../../apis/runner'
import { createAction } from 'reflux'

const asyncAction = {
  asyncResult: true
}

const GalleryActions = {
  listGalleries: createAction(asyncAction),
  getAlbumList: createAction(asyncAction),
  getGallery: createAction(asyncAction),
  updateAlbum: createAction(asyncAction)
}

GalleryActions.getAlbumList.listen(function (userId) {
  runnerApi.getAlbumList(userId)
    .then(this.completed)
    .catch(this.failed)
});


GalleryActions.listGalleries.listen(function (userId) {
  if (userId) {
    runnerApi.getGalleryList(userId)
      .then(this.completed)
      .catch(this.failed)
  } else {
    galleryApi.listGalleries()
      .then((galleryList)=> {
        galleryList.forEach((gallery)=> {
          GalleryActions.getGallery(gallery.id)
        })
        this.completed({
          list: galleryList
        })
        return galleryList;
      })
      .catch(this.failed)
  }
})

GalleryActions.getGallery.listen(function (galleryId, userId, albumOnly) {
  if (userId) {
    runnerApi.getGallery(userId, galleryId)
      .then(this.completed)
      .catch(this.failed)
  } else {
    galleryApi.getGalleryById(galleryId)
      .then(this.completed)
      .catch(this.failed)
  }
})

GalleryActions.updateAlbum.listen(function (data) {
  runnerApi.updateAlbum(data)
    .then(this.completed)
    .catch((err)=> {
      alert(err.error)
      this.failed(err)
    })
});

export default GalleryActions