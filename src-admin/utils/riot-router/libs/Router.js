import riot from 'riot'

import Context from './Context'
import InitialRoute from './InitialRoute'
import Route from './Route'
import DefaultRoute from './DefaultRoute'
import RedirectRoute from './RedirectRoute'
import NotFoundRoute from './NotFoundRoute'

export default class Router {

  constructor() {
    riot.router = this
    riot.observable(this)
    this.interceptors = [this.processRoute.bind(this)]
    this.handler = new InitialRoute()
    this.current = new Context('').response
    this.process = this.process.bind(this)
  }

  route(handler) {
    this.handler = handler
  }

  routes(pathArray) {

    this.route(new Route())
    transformPathTreeToRoutes(pathArray, this.handler)

    function transformPathTreeToRoutes(pathArray, handler) {

      const routes = []

      pathArray.forEach((pathArrItem)=> {

        let routeConfig = Object.assign({
          path: pathArrItem[0],
          tag: pathArrItem[1]
        }, pathArrItem[2])

        if (routeConfig.default) {
          routes.push(
            new DefaultRoute({
              tag: routeConfig.tag,
              api: typeof routeConfig.default === 'object' ? routeConfig.default : undefined
            })
          )
        }

        let route
        if (routeConfig.redirectTo) {
          route = new RedirectRoute({
            from: routeConfig.path,
            to: routeConfig.redirectTo
          })
        } else if (routeConfig.path === '*') {
          route = new NotFoundRoute({
            tag: routeConfig.tag
          })
        } else {
          route = new Route({
            tag: routeConfig.tag,
            path: routeConfig.path
          })
          if (typeof routeConfig.child === 'object') {
            transformPathTreeToRoutes(routeConfig.child, route)
          }
        }
        routes.push(route)
      })

      handler.routes(routes)

    }

  }

  use(interceptor) {
    this.interceptors.push(interceptor)
  }

  process() {
    let params = Array.prototype.slice.call(arguments)
    let context = new Context(params.join('/'))
    this.processRequest(context)
    return context
  }

  processRequest(context) {
    this.processInterceptors(context)
    return this.processResponse(context)
  }

  processResponse(context) {
    if (this.isRedirect(context)) {
      return this.processRedirect(context)
    }
    let { response } = context
    if (!response.redirectTo) {
      this.current = response
      this.trigger('route:updated', response)
      return context
    }
  }

  isRedirect(context) {
    return !!context.response.redirectTo
  }

  processRedirect(context) {
    context.redirectTo(context.response.redirectTo)
    return this.processRequest(context)
  }

  processInterceptors(context, preInterceptors, postInterceptors) {
    let interceptors = (preInterceptors || []).concat(this.interceptors).concat(postInterceptors || [])
    let next = function next() {
      if (!context.stop) {
        let processor = interceptors.shift()
        let {request, response} = context
        if (processor)
          return processor(request, response, next, context)
      }
      return context
    }
    return next()
  }

  processRoute(request, response, next, context) {
    this.handler.process(request, response, context)
    return next()
  }

  start() {
    riot.route(this.process)
    riot.route.start()
    this.exec()
  }

  exec() {
    riot.route.exec(this.process)
  }
}
