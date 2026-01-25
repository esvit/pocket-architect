import {BaseBootstrapEnv} from "../bootstrap";
import {Application} from "./Application";

export
abstract class ApplicationModule {
  abstract initModule(app: Application, scope: BaseBootstrapEnv):Promise<void>;
}
