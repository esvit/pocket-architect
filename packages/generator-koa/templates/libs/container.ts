import { createContainer, InjectionMode, asClass, asValue } from 'awilix';
import env from './env';

const globalContainer = createContainer({
  injectionMode: InjectionMode.PROXY
});
globalContainer.register({
  env: asValue(env)
});

export
function InjectableService(options = {}) {
  return (service) => {
    const regServiceName = service.name;
    globalContainer.register({
      [regServiceName]: asClass(service, options)
    });
  };
}

export
function initContainer(scanFolders) {
  return globalContainer.loadModules(scanFolders, {
    resolverOptions: {}
  });
}
