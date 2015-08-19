import $ from 'jquery'

export default {

  createEvent(data){
    return new Promise((resolve, reject)=> {
      $.ajax({
        method: 'POST',
        data: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json'
        },
        url: '/api/nrc/running-event',
        success: function (data) {
          resolve(data)
        },
        error: function (xhr) {
          reject(JSON.parse(xhr.responseText))
        }
      })
    })
  },

  listEvents(parameters = {}){

    return new Promise((resolve, reject) => {
      $.ajax({
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
        url: `/api/nrc/running-event?${$.param(parameters)}`,
        success: function (data) {
          resolve(data)
        },
        error: function (xhr) {
          reject(JSON.parse(xhr.responseText))
        }
      })
    })

  },

  getEventInfo(id){

    return new Promise((resolve, reject) => {
      $.ajax({
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
        url: `/api/nrc/running-event/${id}`,
        success: function (data) {
          resolve(data)
        },
        error: function (xhr) {
          reject(JSON.parse(xhr.responseText))
        }
      })
    })

  },

  updateEvent(id, data){
    return new Promise((resolve, reject)=> {
      $.ajax({
        method: 'POST',
        data: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json'
        },
        url: `/api/nrc/running-event/${id}`,
        success: function (data) {
          resolve(data)
        },
        error: function (xhr) {
          reject(JSON.parse(xhr.responseText))
        }
      })
    })
  },

  cancelEvent(id, data){

    data = {
      reason: data.reason
    }

    return new Promise((resolve, reject) => {
      $.ajax({
        method: 'DELETE',
        data: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json'
        },
        url: `/api/nrc/running-event/${id}`,
        success: function (data) {
          resolve(data)
        },
        error: function (xhr) {
          reject(JSON.parse(xhr.responseText))
        }
      })
    })
  },

  sendRecap(id){
    return new Promise((resolve, reject) => {
      $.ajax({
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        url: `/api/nrc/running-event/${id}/recap`,
        success: function (data) {
          resolve(data)
        },
        error: function (xhr) {
          reject(JSON.parse(xhr.responseText))
        }
      })
    })
  },

  setQrcode(id){

    return new Promise((resolve, reject) => {
      $.ajax({
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        url: `/api/nrc/running-event/${id}/qrcode`,
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
