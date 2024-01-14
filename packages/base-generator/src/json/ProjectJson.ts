import {promises} from 'fs';
import json5 from 'json5';
import { Reviver, Jsonizer } from '@badcafe/jsonizer';
import { validator } from '@exodus/schemasafe';
import jsonSchema from './JsonSchema';
import ApplicationPart from './ApplicationPart';
import Metadata from './Metadata';
import { Project } from '../domain/Project';

export default
@Reviver<ProjectJson>({
  application: Metadata,
  parts: {
    '*': ApplicationPart
  },
  '.': Jsonizer.Self.assign(ProjectJson)
})
class ProjectJson {
  readonly application: Metadata = null;
  readonly parts: ApplicationPart[] = [];

  static async load(path: string): Promise<Project> {
    const content = await promises.readFile(path, 'utf-8');
    const jsonData = json5.parse(content);
    const reviver = Reviver.get(ProjectJson);
    const validate = validator(jsonSchema, { includeErrors: true });
    if (!validate(jsonData)) {
      throw new Error(`Invalid json: ${JSON.stringify(validate.errors)}`);
    }
    // eslint-disable-next-line  @typescript-eslint/no-explicit-any
    return Project.create(JSON.parse(JSON.stringify(jsonData), reviver) as any);
  }

  static async write(path: string, project: Project): Promise<void> {
    await promises.writeFile(path, JSON.stringify(project));
  }
}
