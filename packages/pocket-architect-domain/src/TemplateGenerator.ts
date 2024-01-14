import {promises as fs} from 'fs';
import path from 'path';
import {Environment} from 'nunjucks';
import PocketArchitect, {Project, ApplicationPart, ApplicationType} from 'pocket-architect-lib';

export type TemplateGeneratorOptions = {
  module?: string;
  service?: string;
  outputDir?: string;
};

export type ContentFile = {
  path: string;
  content: string;
}

export default
class TemplateGenerator {
  engine:Environment = null;

  constructor(
    private readonly options: TemplateGeneratorOptions,
  ) {
    this.engine = PocketArchitect.getTemplateEngine(`${__dirname}/../templates`);
  }

  public async generate(inputFile, outputDir) {
    console.info(this.options);
    const project = await PocketArchitect.load(inputFile);
    console.info(project);
    const files = await this.prepareFiles(project);
    await this.writeFiles(files, outputDir);
    return files;
  }

  async generatePart(part:ApplicationPart, currentPath:string) {
    const files:ContentFile[] = [];
    let partPath = currentPath;

    switch (part.type) {
    case ApplicationType.Service: break;
    case ApplicationType.Module:
      partPath = `${currentPath}/modules/${part.name}`;
      break;
    case ApplicationType.Entity:
      files.push({
        path: `${currentPath}/domain/${part.name}.ts`,
        content: this.engine.render('entity.twig', { entity: part })
      });
      return files;
    case ApplicationType.ValueObject:
      files.push({
        path: `${currentPath}/domain/${part.name}.ts`,
        content: this.engine.render('valueObject.twig', { valueObject: part })
      });
      return files;
    }

    for (const entity of (part.parts || [])) {
      files.push(...await this.generatePart(entity, partPath));
    }
    return files;
  }

  public async prepareFiles(project: Project) {
    const files = [];

    // models
    for (const entity of project.parts) {
      files.push(...await this.generatePart(entity, 'src'));
    }
    return files;
  }

  protected async writeFiles(files:ContentFile[], outputDir:string) {
    await fs.rm(outputDir, { recursive: true, force: true });
    for (const file of files) {
      const fullpath = `${outputDir}/${file.path}`
      await fs.mkdir(path.dirname(fullpath), { recursive: true });
      await fs.writeFile(fullpath, file.content);
    }
  }
}
