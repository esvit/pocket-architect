import { initContainer } from './libs/container';
import { IServer } from './types';

const start = async () => {
  const container = await initContainer([
    `${__dirname}/api/http/*.{ts,js}`,
    `${__dirname}/infra/**/*.{ts,js}`,
  ]);
  const server = container.resolve<IServer>('Server');
  return server.start()
}
start();
