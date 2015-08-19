import Handler from './Handler'

export default class DefaultRoute extends Handler {
  constructor(options) {
    super(options)
    options = options || {}
    this.tag = options.tag
    this.api = options.api
  }

  matches(request) {
    const uri = request.uri.trim()
    if (uri === '/' || uri === '') return {
      route: this,
      tag: this.tag,
      api: this.api,
      params: this.api && this.api.params ? this.api.params : undefined,
      found: uri
    }
  }
}
