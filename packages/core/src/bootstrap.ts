import {createContainer, InjectionMode, asValue, Lifetime, AwilixContainer} from 'awilix';
import {Application} from "./application/Application";

export interface BootstrapOptions {
  appFolder: string;
  domainsFolder: string;
  infraFolder: string;
  scanFolders?: string[]
}

export interface BaseBootstrapEnv {
  app: Application;
  env: string;
  DIContainer: AwilixContainer<BaseBootstrapEnv>;
}

export
async function bootstrap(app: Application, { appFolder, domainsFolder, infraFolder, scanFolders }: BootstrapOptions, env: string = 'dev'):Promise<void> {
  try {
    if (!appFolder) {
      throw new Error('`appFolder` is required')
    }
    if (!domainsFolder) {
      throw new Error('`domainsFolder` is required')
    }
    if (!infraFolder) {
      throw new Error('`infraFolder` is required')
    }

    const rootContainer = createContainer({
      injectionMode: InjectionMode.PROXY
    });
    rootContainer.register({
      app: asValue(app),
      env: asValue(env),
    });
    const scope = rootContainer.createScope();
    scope.register({
      DIContainer: asValue(scope)
    });
    const folders = [];

    // app folder
    // folders.push(`${appFolder}/**/!(*.spec|*.d|index).{ts,js}`);

    // domains folder
    folders.push(`${domainsFolder}/**/!(*.spec|*.d).{ts,js}`);
    folders.push(`${domainsFolder}/**/service/**/!(*.spec|*.d).{ts,js}`);

    // infra folder
    folders.push(`${infraFolder}/**/repository/**/!(*.spec|*.d).{ts,js}`);

    // провайдери реєструються у глобальному контейнері як синглтони і потім через warmupSingletons створюються одразу
    // щоб перевірити чи не використовують вони залежності з transient lifetime
    rootContainer.loadModules([
      [`${infraFolder}/**/providers/**/!(*.spec|*.d).{ts,js}`, { lifetime: Lifetime.SINGLETON }]
    ], { resolverOptions: {} });
    scope.loadModules([...folders, ...(scanFolders ?? [])], { resolverOptions: {} });

    warmupSingletons(scope);
    if (app.prepareApplication) {
      await app.prepareApplication(scope.cradle);
    }
    await app.initApplication(scope.cradle);

    if (app.postInitApplication) {
      await app.postInitApplication(scope.cradle);
    }
  } catch (err) {
    console.info(err);
    throw err;
  }

  function warmupSingletons(container: AwilixContainer) {
    const regs = container.registrations ?? {};
    const names = Object.keys(regs);

    for (const name of names) {
      const r = regs[name];
      // Awilix зберігає lifetime всередині resolver'а (зазвичай r.lifetime)
      if (r?.lifetime === Lifetime.SINGLETON) {
        // важливо: резолвимо саме з ROOT
        container.resolve(name);
      }
    }
  }
}
