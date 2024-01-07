import {promises} from 'fs';
import json5 from 'json5';
import { Reviver, Jsonizer } from '@badcafe/jsonizer';
import Application from "./Application";
import Layer from "./Layer";
import Entity from "./Entity";
import ApplicationPart from "./ApplicationPart";

export default
@Reviver<PocketArchitect>({
  application: Application,
  layers: {
    '*': Layer
  },
  entities: {
    '*': Entity
  },
  parts: {
    '*': ApplicationPart
  },
  '.': Jsonizer.Self.assign(PocketArchitect)
})
class PocketArchitect {
  readonly application: Application = null;
  readonly layers: Layer[] = [];
  readonly entities: Entity[] = [];
  readonly parts: ApplicationPart[] = [];

  static async load(path: string): Promise<PocketArchitect> {
    const content = await promises.readFile(path, 'utf-8');
    const jsonData = json5.parse(content);
    const reviver = Reviver.get(PocketArchitect);
    return JSON.parse(JSON.stringify(jsonData), reviver);
  }

  toJson(): string {
    return JSON.stringify(this);
  }
}
