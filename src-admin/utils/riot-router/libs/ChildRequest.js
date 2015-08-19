export default class ChildRequest {
  constructor(request, matcher) {
    this.request = request
    this.matcher = matcher
    this.uri = this.request.uri.substring(matcher.found.length)
    this.parentUri = this.request.uri.substring(0, matcher.found.length)
  }
}