import $ from 'jquery'

import deviceHelper from '../utils/device-helper'

export default function (opts = {}) {
  this.on('mount', ()=> {
    $(this.root).toggleClass('app--desktop', !deviceHelper.isMobile())
  })
};