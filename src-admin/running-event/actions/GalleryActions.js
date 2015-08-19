import galleryApi from '../../apis/gallery'
import { createAction } from 'reflux'

const asyncAction = {
  asyncResult: true
}

const actions = {
  getGalleryById: createAction(asyncAction),
  removeGalleryImage: createAction(asyncAction)
}

actions.getGalleryById.listen(function (id) {
  galleryApi.getGalleryById(id)
    .then(this.completed)
    .catch(this.failed)
})

actions.removeGalleryImage.listen(function (galleryId, galleryType, imageId) {
  galleryApi.removeGalleryImage(galleryId, galleryType, imageId)
    .then(this.completed)
    .catch(this.failed)
})

export default actions;