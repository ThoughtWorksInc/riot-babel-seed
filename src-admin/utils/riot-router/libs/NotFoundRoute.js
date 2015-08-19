import Handler from './Handler'

export default class NotFoundRoute extends Handler {
  constructor(options) {
    super(options)
    options = options || {}
    this.tag = options.tag
    this.api = options.api
  }

  matches(request) {
    return {route: this, tag: this.tag, api: this.api, found: request.uri}
  }
}