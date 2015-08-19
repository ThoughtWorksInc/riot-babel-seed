export default function (opts = {}) {

  this.uploadingFiles = []
  this.uploadFailedFiles = []

  this.handleFileSelect = (evt)=> {
    let len = evt.target.files.length
    this.uploadFailedFiles = []
    while (len--) {
      this.uploadFile(evt.target.files[len], opts.url)
    }
  }

  this.onErrorItemClose = ()=> {
    this.uploadError = null
    this.update()
  }

  this.uploadFile = (file, uploadUrl) => {

    const formData = new FormData()

    formData.append('file', file)

    const xhr = new XMLHttpRequest()

    xhr.open('POST', uploadUrl, true)

    xhr.upload.addEventListener('progress', (evt)=> {
      file.processing = Math.round(evt.loaded * 100 / evt.total) - 3
      this.update()
    }, false)

    xhr.addEventListener('readystatechange', ()=> {
      if (xhr.readyState === 4) {
        if (xhr.status >= 200 && xhr.status < 300) {
          this.uploadCompleted(file)
        } else {
          this.uploadError = (JSON.parse(xhr.responseText) || {}).error
          this.uploadFailed(file)
        }
      }
    }, false)

    xhr.addEventListener('error', ()=> {
    })

    file.processing = 0
    this.uploadingFiles.push(file)
    this.update()

    xhr.send(formData)

  }

  this.uploadFailed = (file)=> {
    this.uploadFailedFiles.push(file)
    this.removeFileInUploading(file)
    this.update()
  }

  this.removeFileInUploading = (file) => {
    const idx = this.uploadingFiles.indexOf(file)
    if (idx > -1) {
      this.uploadingFiles.splice(idx, 1)
    }
    if (this.uploadingFiles.length === 0) {
      this.uploadAllCompleted()
    }
  }

  this.uploadCompleted = (file)=> {
    this.removeFileInUploading(file)
    this.update()
  }

  this.uploadAllCompleted = ()=> {
    opts.on_upload_completed && opts.on_upload_completed()
  }

}