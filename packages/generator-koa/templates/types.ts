interface ILoggerFunc {
  (msg: string, ...args: any[]): void;
}

export interface ILogger {
  fatal: ILoggerFunc;
  error: ILoggerFunc;
  warn: ILoggerFunc;
  info: ILoggerFunc;
  debug: ILoggerFunc;
  log: ILoggerFunc;
  silent: ILoggerFunc;
}

export interface IServer {
  start(): void
}
