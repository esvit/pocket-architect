import {Environment} from 'nunjucks';
import { Layer, LayerType } from "@pocket-architect/base-generator";


export default
class FileLocatorService {
  protected _pathFormat: Record<LayerType, string> = <Record<LayerType, string>>{};

  constructor(protected readonly _engine:Environment) {
  }

  configurePath(type: LayerType, path: string) {
    this._pathFormat[type] = path;
  }

  getFolderFor(part: Layer) {
    if (!this._pathFormat[part.type]) {
      throw new Error(`Path format for ${part.type} is not configured`);
    }
    return this._engine.renderString(this._pathFormat[part.type], { part });
  }

  getLocationFor(part: Layer) {
    return part.path.filter(i => i).map((i) => this.getFolderFor(i)).join('/');
  }
}
