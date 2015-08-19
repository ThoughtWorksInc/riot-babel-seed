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
  this.mixin(Reflux.listenTo(UserStore, 'onListStoreUpdate'))

  this.onListStoreUpdate = ()=> {
    this.getStateFromStore()
    this.update()
  }

  this.updatePageTitle = ()=> {
    global.document.title = `${this.userName ? this.userName + '-' : ''} Nike+ Run Club 跑步课程`
  }

  this.getStateFromRouter = ()=> {
    const params = riot.router.current.params
    this.galleryId = params.galleryId
    this.userId = params.userId
  }

  this.getStateFromStore = ()=> {
    this.galleryList = GalleryListStore.galleryList;
    this.userName = UserStore.userName;
    this.updatePageTitle()
  }

  this.editAlbum = (gallery, evt)=> {
    evt.preventDefault()
    riot.route(`/${this.userId}/gallery/${gallery.id}/detail`)
  }

  this.getStateFromRouter()
  this.getStateFromStore()

  this.editable = UserStore.isUserOwner(this.userId)

  this.setWechatShareInfoByGallery = ()=> {
    wechat.shareRegister(
      'Nike+ Run Club',
      this.userId,
      `${BaseUrls.SHARE_LOGO_BASE_URL}NRC_LOGO.jpg`,
      wechat.getTransformedCurrentUrl()
    )
  }


  this.on('mount', ()=> {
    GalleryActions.listGalleries(riot.router.current.params.userId)
    this.setWechatShareInfoByGallery()
  })

}
