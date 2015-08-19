import Response from './Response'
import Request from './Request'

export default class Context {
  constructor(request) {
    this.request = typeof(request) === 'string' ? new Request(request) : request
    this.response = new Response(this.request)
    this.redirectStack = []
  }

  redirectTo(uri) {
    if (this.redirectStack.indexOf(uri) > -1)
      throw new Error(`Cyclic redirection to ${uri}. Stack = ${this.redirectStack}`)
    this.redirectStack.push(uri)
    this.request = new Request(uri)
    this.response = new Response(this.request)
  }
}
