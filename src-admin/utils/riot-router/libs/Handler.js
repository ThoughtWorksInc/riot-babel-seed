import ChildRequest from './ChildRequest'

export default class Handler {
  constructor() {
  }

  matches(request) {
    return false
  }

  process(request, response) {
    let matcher = this.matches(request)
    if (!matcher) return this.processNotMatch(request, response)
    return this.processMatch(request, response, matcher)
  }

  processMatch(request, response, matcher) {
    response.add(matcher)
    return true
  }

  processNotMatch(request, response) {
    return false
  }

  processRoutes(request, response, routes) {
    if (routes && routes.length) {
      let t = routes.length
      for (let i = 0; i < t; i++) {
        let route = routes[i]
        if (route.process(request, response)) {
          return true
        }
      }
      return false
    }
  }

  createRequest(request, matcher) {
    return new ChildRequest(request, matcher)
  }
}