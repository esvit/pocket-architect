import {BaseBootstrapEnv} from "../bootstrap";
import type {ApplicationModule} from "./ApplicationModule";

export
abstract class Application {
  protected _modules: ApplicationModule[] = [];

  abstract initApplication(scope: BaseBootstrapEnv):Promise<void>;

  prepareApplication?(scope: BaseBootstrapEnv): Promise<void>;

  postInitApplication?(scope: BaseBootstrapEnv): Promise<void>;

  async initModules(modules: ApplicationModule[], scope: BaseBootstrapEnv): Promise<void> {
    for (const module of modules) {
      await module.initModule(this, scope);
      this._modules.push(module);
    }
  }

  get modules(): ApplicationModule[] {
    return this._modules;
  }
}
