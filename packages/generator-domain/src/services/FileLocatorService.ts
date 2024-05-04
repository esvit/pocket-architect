import {Environment} from 'nunjucks';
import { SchemaObject, SchemaObjectType } from "@pocket-architect/base-generator";


export default
class FileLocatorService {
  protected _pathFormat: Record<SchemaObjectType, string> = <Record<SchemaObjectType, string>>{};

  constructor(protected readonly _engine:Environment) {
  }

  configurePath(type: SchemaObjectType, path: string) {
    this._pathFormat[type] = path;
  }

  getFolderFor(part: SchemaObject) {
    if (!this._pathFormat[part.type]) {
      throw new Error(`Path format for ${part.type} is not configured`);
    }
    return this._engine.renderString(this._pathFormat[part.type], { part });
  }

  getLocationFor(part: SchemaObject) {
    return part.path.filter(i => i).map((i) => this.getFolderFor(i)).join('/');
  }
}
