import $ from 'jquery'

export default {

  getGalleryById(id) {
    return new Promise((resolve, reject) => {
      $.ajax({
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
        url: `/api/nrc/gallery/${id}`,
        success: function (data) {
          resolve(data)
        },
        error: function (xhr) {
          reject(JSON.parse(xhr.responseText))
        }
      })
    })
  },

  listGalleries(){
    return new Promise((resolve, reject) => {
      $.ajax({
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
        url: `/api/nrc/gallery/`,
        success: function (data) {
          resolve(data)
        },
        error: function (xhr) {
          reject(JSON.parse(xhr.responseText))
        }
      })
    })
  },

  removeGalleryImage(galleryId, galleryType, imageId){
    return new Promise((resolve, reject) => {
      $.ajax({
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        url: `/api/nrc/gallery/${galleryId}/${galleryType}/${imageId}`,
        success: function (data) {
          resolve(data)
        },
        error: function (xhr) {
          reject(JSON.parse(xhr.responseText))
        }
      })
    })
  }

}
