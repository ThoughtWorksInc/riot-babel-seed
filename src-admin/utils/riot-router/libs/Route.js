import Handler from './Handler'
import DefaultRoute from './DefaultRoute'
import NotFoundRoute from './NotFoundRoute'
import RedirectRoute from './RedirectRoute'

const error = console.error()

export default class Route extends Handler {
  constructor(options) {
    super(options)
    options = options || {}
    this.tag = options.tag
    this.api = options.api
    this.name = options.name
    this.path = options.path || this.name || this.tag || ''
    this.pathParameterNames = []
    let path = this.path.replace(/^\//, '')
    this.pattern = '^/?' + path.replace(/:([^/]+)/g, (ignored, group)=> {
        this.pathParameterNames.push(group)
        return '([^/]+)'
      }) + '(:?/|$)'
    this.regex = new RegExp(this.pattern)
  }

  routes(routes) {
    let redirectRoutes = routes.filter(function (r) {
      return r instanceof RedirectRoute
    })
    let defaultRoutes = routes.filter(function (r) {
      return r instanceof DefaultRoute
    })
    let notFoundRoutes = routes.filter(function (r) {
      return r instanceof NotFoundRoute
    })
    let otherRoutes = routes.filter(function (r) {
      return redirectRoutes.indexOf(r) === -1
        && defaultRoutes.indexOf(r) === -1
        && notFoundRoutes.indexOf(r) === -1
    })
    if (notFoundRoutes.length > 1) error('Can\'t use more than one NotFoundRoute per route. --> ' + (this.name || this.path || this.tag))
    if (defaultRoutes.length > 1) error('Can\'t use more than one DefaultRoute per route. --> ' + (this.name || this.path || this.tag))
    this._routes = [].concat(redirectRoutes).concat(otherRoutes).concat(defaultRoutes).concat(notFoundRoutes)
    return this
  }

  matches(request) {
    let matcher = this.regex.exec(request.uri)
    if (matcher) {
      let params = {}
      for (let i in this.pathParameterNames) {
        let name = this.pathParameterNames[i]
        params[name] = matcher[parseInt(i, 10) + 1]
      }
      return {route: this, tag: this.tag, api: this.api, found: matcher[0], params: params}
    }
    return false
  }

  processMatch(request, response, matcher) {
    let matches = super.processMatch(request, response, matcher)
    this.processRoutes(request, response, matcher)
    return matches
  }

  processRoutes(request, response, matcher) {
    return super.processRoutes(super.createRequest(request, matcher), response, this._routes)
  }
}
