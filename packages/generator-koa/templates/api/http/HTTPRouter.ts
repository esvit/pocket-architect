import Router, { RouterContext } from '@koa/router'

export default
class HTTPRouter {

  get(): Router {
    return new Router()
      .get('/item', (ctx: RouterContext) => ctx.body = 'OK');
  }
}
