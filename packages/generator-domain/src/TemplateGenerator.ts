import path from 'path';
import {Environment} from 'nunjucks';
import PocketArchitect, {
  BaseTemplateGenerator, ContentFile,
  Project, Layer, LayerType, Entity
} from '@pocket-architect/base-generator';
import FileLocatorService from './services/FileLocatorService';

export default
class TemplateGenerator extends BaseTemplateGenerator {
  protected _fileLocator:FileLocatorService = null;
  protected _engine:Environment = null;

  constructor() {
    super();
    this._engine = PocketArchitect.getTemplateEngine(`${__dirname}/../templates`);

    this._fileLocator = new FileLocatorService(this._engine);
    this._fileLocator.configurePath(LayerType.Domain, '{{part.folderName}}');
    this._fileLocator.configurePath(LayerType.Context, 'contexts/{{part.folderName}}');
    this._fileLocator.configurePath(LayerType.Interface, 'domain/interfaces/{{part.name}}');
    this._fileLocator.configurePath(LayerType.Entity, 'domain/entity/{{part.name}}');
    this._fileLocator.configurePath(LayerType.ValueObject, 'domain/valueObject/{{part.name}}');
    this._fileLocator.configurePath(LayerType.Repository, 'domain/repository/{{part.name}}');
    this._fileLocator.configurePath(LayerType.Service, 'services/{{part.name}}');
    this._fileLocator.configurePath(LayerType.Aggregate, 'domain/aggregates/{{part.name}}');

    this._engine.addFilter('dependencyPath', (part:Layer, fileLocation:string) => {
      return path.relative(path.dirname(fileLocation), this._fileLocator.getLocationFor(part));
    });
  }

  async generatePart(part:Layer|Entity) {
    const files:ContentFile[] = [];
    let partPath = this._fileLocator.getLocationFor(part);

    switch (part.type) {
    case LayerType.Domain: break;
    case LayerType.Context: break;
    case LayerType.Entity: {
      const entity = part as Entity;
      {
        // console.info(entity, entity.context);
        const path = `${partPath}.ts`;
        const content = this._engine.render('entity.twig', {
          entity,
          path,
          dependencies: entity.dependencies
        });
        files.push({path, content});
      }
      {
        const path = `${this._fileLocator.getLocationFor(entity.interface)}.ts`;
        const content = this._engine.render('interface.twig', {
          entity,
          path,
          interface: entity.interface
        });
        files.push({path, content});
      }
      {
        const path = `${this._fileLocator.getLocationFor(entity.repository)}.ts`;
        const content = this._engine.render('repository.twig', {
          entity,
          path,
          repository: entity.repository
        });
        files.push({path, content});
      }
      {
        const path = `${this._fileLocator.getLocationFor(entity.service)}.ts`;
        const content = this._engine.render('service.twig', {
          entity,
          path,
          service: entity.service
        });
        files.push({path, content});
      }
      {
        const path = `${this._fileLocator.getLocationFor(entity.service)}.spec.ts`;
        const content = this._engine.render('serviceTest.twig', {
          entity,
          path,
          service: entity.service
        });
        files.push({path, content});
      }
      return files.map((file) => ({ ...file, content: file.content.trim() }));
    }
    case LayerType.ValueObject:
      files.push({
        path: `${partPath}.ts`,
        content: this._engine.render('valueObject.twig', { valueObject: part })
      });
      return files;
    }

    for (const entity of (part.layers || [])) {
      files.push(...await this.generatePart(entity));
    }
    return files;
  }

  public async prepareFiles(project: Project) {
    const files = [];

    // models
    for (const entity of project.layers) {
      files.push(...await this.generatePart(entity));
    }
    return files;
  }
}
