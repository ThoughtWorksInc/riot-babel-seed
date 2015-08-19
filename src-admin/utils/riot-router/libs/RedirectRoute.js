import Handler from './Handler'

export default class RedirectRoute extends Handler {

  constructor(options) {
    super(options)
    options = options || {}
    this.from = options.from
    this.to = options.to
    this.pattern = '(^/?)' + this.from + '(/|$)'
    this.regex = new RegExp(this.pattern)
  }

  process(request, response) {
    let uri = request.uri.replace(this.regex, '$1' + this.to + '$2')
    if (uri !== request.uri) {
      let parent = request.parentUri || ''
      // Rewrite response.uri & request.uri
      response.uri = parent + uri
      request.uri = uri
    }
  }

}