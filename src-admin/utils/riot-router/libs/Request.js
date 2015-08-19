export default class Request {
  constructor(uri) {
    const uriPair = uri.split('?')
    this.originUri = uri
    this.uri = uriPair[0]
    this.search = uriPair[1]
  }
}