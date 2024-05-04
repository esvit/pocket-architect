import {Environment} from 'nunjucks';
import PocketArchitect, {
  BaseTemplateGenerator, ContentFile, Project, Entity, LayerType, Layer
} from '@pocket-architect/base-generator';

export default
class TemplateGenerator extends BaseTemplateGenerator {
  engine:Environment = null;

  constructor() {
    super();
    this.engine = PocketArchitect.getTemplateEngine(`${__dirname}/../templates`);
  }

  async generatePart(part:Layer|Entity, currentPath:string) {
    const files:ContentFile[] = [];
    let partPath = currentPath;

    switch (part.type) {
      case LayerType.Domain: break;
      case LayerType.Context:
        partPath = `${currentPath}/modules/${part.name}`;
        break;
      case LayerType.Entity: {
        const entity = part as Entity;
        files.push({
          path: `${currentPath}/infra/database/sequelize/models/${entity.name}.ts`,
          content: this.engine.render('model.twig', {entity})
        });
        files.push({
          path: `${currentPath}/infra/database/sequelize/repository/${entity.repository.name}.ts`,
          content: this.engine.render('repository.twig', {entity})
        });
        return files;
      }
      case LayerType.ValueObject:
        files.push({
          path: `${currentPath}/infra/database/sequelize/models/${part.name}.ts`,
          content: this.engine.render('model.twig', {entity: part})
        });
        return files;
    }

    for (const entity of (part.layers || [])) {
      files.push(...await this.generatePart(entity, partPath));
    }
    return files;
  }

  public async prepareFiles(project: Project) {
    const files = [];

    // models
    for (const entity of project.layers) {
      files.push(...await this.generatePart(entity, '.'));
    }
    return files;
  }
}
