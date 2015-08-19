import $ from 'jquery'
import deviceHelper from './device-helper'
import scriptjs from 'scriptjs'
import qs from 'qs'
import cookies from 'js-cookie'

const wechatScript = '//res.wx.qq.com/open/js/jweixin-1.0.0.js';
const jsApiList = [
  'checkJsApi',
  'onMenuShareTimeline',
  'onMenuShareAppMessage',
  'onMenuShareQQ',
  'onMenuShareWeibo',
  'hideMenuItems',
  'showMenuItems',
  'hideAllNonBaseMenuItem',
  'showAllNonBaseMenuItem',
  'translateVoice',
  'startRecord',
  'stopRecord',
  'onRecordEnd',
  'playVoice',
  'pauseVoice',
  'stopVoice',
  'uploadVoice',
  'downloadVoice',
  'chooseImage',
  'previewImage',
  'uploadImage',
  'downloadImage',
  'getNetworkType',
  'openLocation',
  'getLocation',
  'hideOptionMenu',
  'showOptionMenu',
  'closeWindow',
  'scanQRCode',
  'chooseWXPay',
  'openProductSpecificView',
  'addCard',
  'chooseCard',
  'openCard'
];

if (deviceHelper.isWechat()) {
  console.log = (value)=> {
    window.alert(typeof value === 'object' ? JSON.stringify(value) : value)
  }
}

const wechat = {

  ready(needConfig){
    if (deviceHelper.isWechat()) {
      if (needConfig) {
        return this.config()
      }
      return new Promise((resolve, reject)=> {
        scriptjs(wechatScript, ()=> {
          resolve(window.wx)
        })
      })
    }
    return new Promise((resolve, reject)=> {
      resolve();
    })
  },

  getAuth() {
    return {
      openid: cookies.get('openid')
    }
  },

  tryResolveUrl(){
    const query = qs.parse(location.search.slice(1)) || {};
    if (query.state && query.state.charAt(0) === '#') {
      const location = window.location
      const hash = query.state
      delete query.state
      const queryString = qs.stringify(query)
      window.location.href = `${location.origin}${location.pathname}${queryString ? '?' + queryString : ''}${hash}`
    }
  },

  getTransformedCurrentUrl(hash){
    const location = window.location
    const query = qs.parse(location.search.slice(1)) || {}
    query.state = hash || location.hash
    const queryString = qs.stringify(query)
    return `${location.origin}${location.pathname}${queryString ? '?' + queryString : ''}`
  },

  config(){
    return new Promise((resolve, reject) => {
      $.ajax({
          url: '/sdk/config',
          type: 'GET',
          timeout: 30000,
          data: {
            url: window.location.href
          },
          success: (data)=> {
            wechat.ready()
              .then((wx)=> {
                if (wx) {
                  wx.config(Object.assign(data.data, {
                    //debug: true,
                    jsApiList: jsApiList
                  }))
                  wx.ready(()=> {
                    resolve(wx)
                  })
                  wx.error((err)=> {
                    console.log(err)
                    reject(err)
                  })
                }
              })
              .catch(reject)
          }
        }
      )
    })
  },

  previewImage(current = '', urls = []){
    return this.ready()
      .then((wx)=> {
        wx && wx.previewImage({
          current: current,
          urls: urls
        })
        return wx;
      })
  },

  shareRegister(title, desc, imgUrl, link){
    return this.ready(true)
      .then((wx)=> {
        if (wx) {
          [
            'onMenuShareTimeline',
            'onMenuShareAppMessage',
            'onMenuShareQQ',
            'onMenuShareWeibo',
            'onMenuShareQZone'
          ]
            .forEach((eventName)=> {
              wx[eventName]({
                title: eventName === 'onMenuShareTimeline' ? desc : title,
                desc: desc,
                imgUrl: imgUrl,
                link: link,
                success: function () {
                  $(document).trigger('wechat:shared', {
                    status: 'success'
                  })
                  window.ga && window.ga('send', 'event', 'WeChat', eventName)
                },
                cancel: function () {
                  $(document).trigger('wechat:shared', {
                    status: 'cancel'
                  })
                }
              })
            })
        }
        return wx;
      });
  }
};

export default wechat;