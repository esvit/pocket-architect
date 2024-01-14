import pino from 'pino'
import { ILogger } from '../../types';

export default class Logger implements ILogger {
  protected _logger: pino.Logger;

  constructor() {
    this._logger = pino({
      transport: {
        target: 'pino-pretty',
        options: {
          colorize: true
        }
      },
      level: 'info'
    });
  }

  debug(msg: string, ...args: any[]) {
    this._logger.debug(msg, ...args);
  }
  log(msg: string, ...args: any[]) {
    this._logger.info(msg, ...args);
  }
  info(msg: string, ...args: any[]) {
    this._logger.info(msg, ...args);
  }
  error(msg: string, ...args: any[]) {
    this._logger.error(msg, ...args);
  }
  fatal(msg: string, ...args: any[]) {
    this._logger.fatal(msg, ...args);
  }
  silent(msg: string, ...args: any[]) {
    this._logger.silent(msg, ...args);
  }
  warn(msg: string, ...args: any[]) {
    this._logger.warn(msg, ...args);
  }
}
