import nunjucks from 'nunjucks';
import pluralize from 'pluralize';
import {promises} from 'fs';
import { Project } from './domain/Project';
import {capitalize, variableCase} from './helpers/string';
import json5 from 'json5';
import {validator} from '@exodus/schemasafe';
import jsonSchema from './JsonSchema';

export default
class PocketArchitect {
  static async load(path: string): Promise<Project> {
    const content = await promises.readFile(path, 'utf-8');
    return this.loadString(content);
  }

  static async loadString(content: string): Promise<Project> {
    const jsonData = json5.parse(content);
    const validate = validator(jsonSchema, { includeErrors: true });
    if (!validate(jsonData)) {
      throw new Error(`Invalid json: ${JSON.stringify(validate.errors)}`);
    }
    // eslint-disable-next-line  @typescript-eslint/no-explicit-any
    return Project.create(jsonData as any);
  }

  static saveString(project: Project): string {
    const str = JSON.stringify(project);
    const jsonData = JSON.parse(str);
    const validate = validator(jsonSchema, { includeErrors: true });
    if (!validate(jsonData)) {
      throw new Error(`Invalid json: ${JSON.stringify(validate.errors)}`);
    }
    return str;
  }

  static async write(path: string, project: Project): Promise<void> {
    const content = this.saveString(project);
    return promises.writeFile(path, content);
  }

  static getTemplateEngine(templateRoot:string):nunjucks.Environment {
    const loader = new nunjucks.FileSystemLoader(templateRoot);
    const env = new nunjucks.Environment(loader);
    env.addFilter('capitalize', capitalize);
    env.addFilter('variableCase', variableCase);
    env.addFilter('pluralize', pluralize);
    return env;
  }
}
