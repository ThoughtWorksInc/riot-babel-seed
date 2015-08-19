import cookies from 'js-cookie'
import { createStore } from 'reflux'
import GalleryActions from '../actions/GalleryActions'

export default createStore({

  init(){
    this.userId = cookies.get('userid') || '_nobody'
    this.listenTo(GalleryActions.listGalleries.completed, 'onGalleryListUpdate')
  },

  onGalleryListUpdate(result){
    if (result.runnerName) {
      this.userName = result.runnerName
    }
  },

  isUserOwner(userId){
    return userId === this.userId
  }

})