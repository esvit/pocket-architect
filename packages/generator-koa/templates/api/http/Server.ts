import Koa from 'koa'
import cors from '@koa/cors'
import bodyParser from 'koa-bodyparser'
import compress from 'koa-compress'
import Router from '@koa/router'
import helmet from 'koa-helmet';
import { isProdEnv } from '../../libs/env';
import {ILogger, IServer} from '../../types';
import { errorMiddleware, devErrorMiddleware } from './middlewares/error';

export default
class Server implements IServer {
  _httpPort: number;
  _bodyLengthLimit: string;
  _logger: ILogger;
  _router: Router;

  constructor({ Logger, HTTPRouter, env }) {
    this._httpPort = env('HTTP_PORT');
    this._bodyLengthLimit = env('BODY_LENGTH_LIMIT');
    this._logger = Logger;
    this._router = HTTPRouter.get();
  }

  start(): void {
    if (!(new Date()).toString().includes('+0000')) {
      throw new Error('Please set your timezone to UTC (env TZ=UTC)');
    }

    const router = this._router;
    const logger = this._logger;
    // const env = String(process.env)

    router.get('/robots.txt', (ctx) => { ctx.body = 'User-Agent: *\nDisallow: /' });
    router.get('/health', (ctx) => { ctx.body = 'OK' });

    const app = new Koa();
    app.proxy = true;

    app
      .use(cors({
        credentials: true,
        origin: (ctx) => ctx.request.header.origin
      }))
      .use(bodyParser({
        formLimit: this._bodyLengthLimit,
        jsonLimit: this._bodyLengthLimit
      }))
      .use(helmet({
        // щоб працював вхід через window.open (google auth)
        contentSecurityPolicy: false,
        crossOriginOpenerPolicy: false
      }))
      .use(compress())
      .use(isProdEnv ? errorMiddleware : devErrorMiddleware)
      .use(router.routes())

    app.on('error', (err) => {
      if (process.env.NODE_ENV !== 'test') {
        logger.error(err)
      }
    })

    app.listen(this._httpPort);
    logger.info(`Listening on http://localhost:${this._httpPort}`)
  }
}
