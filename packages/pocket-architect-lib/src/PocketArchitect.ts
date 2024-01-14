import nunjucks from 'nunjucks';
import ProjectJson from './json/ProjectJson';
import { Project } from './domain/Project';
import { capitalize } from './helpers/string';

export default
class PocketArchitect {
  static async load(path: string): Promise<Project> {
    const project = await ProjectJson.load(path);

    return project;
  }

  static async write(path: string, project: Project): Promise<void> {
    return ProjectJson.write(path, project);
  }

  static getTemplateEngine(templateRoot:string) {
    const loader = new nunjucks.FileSystemLoader(templateRoot);
    const env = new nunjucks.Environment(loader);
    env.addFilter('capitalize', capitalize);
    return env;
  }
}
