import $ from 'jquery'
import deviceHelper from '../../utils/device-helper'

import BaseUrls from '../constants/BaseUrls'

const shareTipFlag = 'gallery-banner--share-tip'

export default function (opts) {

  this.bannerBaseUrl = BaseUrls.GALLERY_BANNER_BASE_URL
  this.isWechat = deviceHelper.isWechat()
  this._timeoutId = null

  this.getStateFromOpts = ()=> {
    this.backgroundImage = `${this.bannerBaseUrl}${opts.type ? opts.type : 'NTC_RUN'}.jpg`
  }

  this.onShareBtnClick = ()=> {
    this.hideShareTip()
    this.$root.addClass(shareTipFlag)
    this._timeoutId = setTimeout(()=> {
      this.hideShareTip()
    }, 20000)
  }

  this.hideShareTip = ()=> {
    this.$root.removeClass(shareTipFlag)
    if (this._timeoutId) {
      clearTimeout(this._timeoutId)
      this._timeoutId = null
    }
  }

  $(document).on('wechat:shared', (evt)=> {
    this.hideShareTip()
  })

  this.getStateFromOpts()

  this.on('mount', ()=> {
    this.$root = $(this.root)
  })

  this.on('update', ()=> {
    this.getStateFromOpts()
  })
}