import {Environment} from 'nunjucks';
import PocketArchitect, {
  BaseTemplateGenerator, ContentFile,
  Project, ApplicationPart, ApplicationType, Entity
} from '@pocket-architect/base-generator';

export default
class TemplateGenerator extends BaseTemplateGenerator {
  engine:Environment = null;

  constructor() {
    super();
    this.engine = PocketArchitect.getTemplateEngine(`${__dirname}/../templates`);
  }

  async generatePart(part:ApplicationPart|Entity, currentPath:string) {
    const files:ContentFile[] = [];
    let partPath = currentPath;

    switch (part.type) {
    case ApplicationType.Service: break;
    case ApplicationType.Module:
      partPath = `${currentPath}/modules/${part.name}`;
      break;
    case ApplicationType.Entity: {
      const entity = part as Entity;
      files.push({
        path: `${currentPath}/domain/${entity.name}.ts`,
        content: this.engine.render('entity.twig', {entity})
      });
      files.push({
        path: `${currentPath}/domain/repository/${entity.repositoryName}.ts`,
        content: this.engine.render('repository.twig', {entity})
      });
      return files;
    }
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
      files.push(...await this.generatePart(entity, '.'));
    }
    return files;
  }
}
