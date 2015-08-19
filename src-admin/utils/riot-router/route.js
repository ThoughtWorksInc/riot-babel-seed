import riot from 'riot'

export default function () {

  this.calculateLevel = (target)=> {
    let level = 0
    if (target.parent) level += this.calculateLevel(target.parent)
    if (target.opts.__router_level) level += target.opts.__router_level
    if (target.__router_tag) level += 1
    return level
  }

  this.unmountTag = function () {
    if (this.instance)
      this.instance.forEach(function (instance) {
        instance.unmount(true)
      })
  }

  this.mountTag = function (tag, api) {
    this.unmountTag()
    if (tag) {
      this.root.replaceChild(document.createElement(tag), this.root.children[0])
      this.instance = riot.mount(this.root.children[0], tag, api)
    }
  }

  this.updateRoute = ()=> {
    let mount = {tag: null}
    if (riot.router && riot.router.current) {
      let response = riot.router.current
      if (this.level <= response.size()) {
        let matcher = response.get(this.level)
        if (matcher) {
          let params = matcher.params || {}
          let api = Object.assign({}, matcher.api, params, {__router_level: this.level})
          mount = {tag: matcher.tag, api: api}
        }
      }
    }
    this.mountTag(mount.tag, mount.api)
  }

  this.__router_tag = 'route'
  this.level = this.calculateLevel(this)
  riot.router.on('route:updated', this.updateRoute)

  this.on('unmount', function () {
    riot.router.off('route:updated', this.updateRoute)
    this.unmountTag()
  }.bind(this))

}