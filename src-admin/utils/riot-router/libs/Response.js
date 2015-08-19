import qs from 'qs'

export default class Response {

  constructor(request) {
    this.originUri = request.originUri
    this.uri = request.uri
    this.matches = []
    this.params = {}
    this.query = qs.parse(request.search)
  }

  add(matcher) {
    this.matches.push(matcher)
    let params = matcher.params
    if (params) {
      for (let key in params) {
        if (params.hasOwnProperty(key)) {
          this.params[key] = params[key]
        }
      }
    }
  }

  get(index) {
    return this.matches[index]
  }

  size() {
    return this.matches.length
  }

  isEmpty() {
    return this.matches.length
  }

}