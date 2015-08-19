import RunningEventActions from '../actions/RunningEventActions'
import GalleryActions from '../actions/GalleryActions'

export default function (opts = {}) {

  this.updateGallery = ()=> {
    GalleryActions.getGalleryById(opts.detail.galleryId)
      .catch((err)=> {
        this.setError(err.error)
      })
  }

  this.onErrorItemClose = ()=> {
    this.error = null
    this.update()
  }

  this.setError = (errorMsg)=> {
    this.error = errorMsg
    this.update()

  }

  this.freshList = ()=> {
    RunningEventActions.listEvents()
  }

  this.handleSubmit = (data)=> {
    RunningEventActions.updateEvent(opts.detail.id, data)
      .then(()=> {
        this.freshList()
      })
      .catch((err)=> {
        this.setError(err.error)
      })
  }

  this.sendRecap = ()=> {
    if (window.confirm('Sure ?')) {
      RunningEventActions.sendRecap(opts.detail.id)
        .then(()=> {
          this.freshList()
        })
        .catch((err)=> {
          this.setError(err.error)
        })
    }
  }

  this.cancelEvent = ()=> {
    let reason = ''
    if (reason = window.prompt('Cancel reason ?')) {
      RunningEventActions.cancelEvent(opts.detail.id, {
        reason: reason
      })
        .then(()=> {
          this.freshList()
        })
        .catch((err)=> {
          this.setError(err.error)
        })
    }
  }

  this.deleteAllGalleryByType = (type)=> {
    return ()=> {
      if (window.confirm('Sure ?')) {
        opts.detail.gallery[`${type}s`].forEach((imageItem)=> {
          GalleryActions.removeGalleryImage(opts.detail.gallery.id, type, imageItem.id)
            .catch((err)=> {
              this.setError(err.error)
            })
        })
      }
    }
  }

}