import Route from './Route'

export default class InitialRoute extends Route {
  processMatch() {
    return true
  }

  processRoutes(request, response, matcher) {
    return super.processRoutes(request, response, this._routes)
  }
}