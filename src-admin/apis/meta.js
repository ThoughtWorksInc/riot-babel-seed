import $ from 'jquery'

export default {

  fetchRunningEventTypes(id){
    return new Promise((resolve, reject) => {
      $.ajax({
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
        url: `/api/nrc/running-event/meta/event-types`,
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
