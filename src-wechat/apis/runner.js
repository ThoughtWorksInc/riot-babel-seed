import $ from 'jquery'
import cookies  from 'js-cookie'

const runner = {}

runner.getAlbumList = (userId)=> {

  return new Promise((resolve, reject) => {
    $.ajax({
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      url: `/api/nrc/runner/${userId}/album`,
      success: function (data) {
        resolve(data)
      },
      error: function (xhr) {
        reject(JSON.parse(xhr.responseText))
      }
    })
  })
}

runner.getGalleryList = (userId)=> {

  return new Promise((resolve, reject) => {
    $.ajax({
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      url: `/api/nrc/runner/${userId}/gallery`,
      success: function (data) {
        resolve(data)
      },
      error: function (xhr) {
        reject(JSON.parse(xhr.responseText))
      }
    })
  })
}

runner.getGallery = (userId, galleryId)=> {

  return new Promise((resolve, reject) => {
    $.ajax({
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      url: `/api/nrc/runner/${userId}/gallery/${galleryId}`,
      success: function (data) {
        resolve(data)
      },
      error: function (xhr) {
        reject(JSON.parse(xhr.responseText))
      }
    })
  })
}

runner.updateAlbum = (data)=> {

  const userId = cookies.get('userid')

  const reqBody = {
    'galleryPhotoExtIds': data.galleryPhotoExtIds
  }

  return new Promise((resolve, reject) => {
    $.ajax({
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'nrc_access_token': cookies.get('nrc_access_token')
      },
      data: JSON.stringify(reqBody),
      url: `/api/nrc/runner/${userId}/album/${data.galleryId}`,
      success: function (data) {
        resolve(data)
      },
      error: function (xhr) {
        reject(JSON.parse(xhr.responseText))
      }
    })
  })
}

export default runner;