import riot from 'riot'
import Reflux from 'reflux'
import wechat  from '../utils/wechat'

import GalleryActions from './actions/GalleryActions'
import GalleryListStore from './stores/GalleryListStore'
import UserStore from './stores/UserStore'

import Links from './constants/Links'
import BaseUrls from './constants/BaseUrls'

export default function () {

  this.Links = Links;

  this.mixin(Reflux.listenTo(GalleryListStore, 'onListStoreUpdate'))

  this.onListStoreUpdate = ()=> {
    this.getStateFromStore()
    this.update()
  }

  this.updatePageTitle = ()=> {
    global.document.title = `${this.gallery.typeText} - Nike+ Run Club 跑步课程`
  }

  this.setWechatShareInfoByGallery = (gallery)=> {
    wechat.shareRegister(
      gallery.typeText + (gallery.tagline ? ('-' + gallery.tagline) : ''),
      gallery.shareText,
      `${BaseUrls.SHARE_LOGO_BASE_URL}${gallery.type}.jpg`,
      wechat.getTransformedCurrentUrl()
    )
  }

  this.editAlbum = (evt)=> {
    evt.preventDefault()
    riot.route(`/${this.userId}/gallery/${this.gallery.id}/detail`)
  }

  this.getStateFromRouter = ()=> {
    const params = riot.router.current.params
    this.galleryId = params.galleryId
    this.userId = params.userId
  }

  this.getStateFromStore = ()=> {
    this.gallery = GalleryListStore.getGalleryById(this.galleryId) || {};
    this.updatePageTitle()
  }

  this.getStateFromRouter()
  this.getStateFromStore()

  this.editable = UserStore.isUserOwner(this.userId)

  this.on('mount update', ()=> {
    if (this.gallery.id !== this.galleryId) {
      GalleryActions.getGallery(this.galleryId, this.userId)
        .then((gallery)=> {
          this.setWechatShareInfoByGallery(gallery)
        })
    } else {
      this.setWechatShareInfoByGallery(this.gallery)
    }
  })

}
