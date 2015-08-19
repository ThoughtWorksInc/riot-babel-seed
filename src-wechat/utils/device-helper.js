function isMobile() {
  return /mobile/.test(window.navigator.userAgent.toLowerCase())
}

function isWechat() {
  return (/micromessenger/i).test(window.navigator.userAgent.toLowerCase())
}

export default {
  isMobile: isMobile,
  isWechat: isWechat
}