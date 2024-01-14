import {Environment} from 'nunjucks';
import { promises as fs } from 'fs';
import PocketArchitect, {
  BaseTemplateGenerator, ContentFile,
  Project, ApplicationType
} from '@pocket-architect/base-generator';

const TEMPLATE_INITIAL_FILES = [
  'src/lib/app.ts',
  'src/lib/container.ts',
  'src/lib/env.spec.ts',
  'src/lib/env.ts',
  'src/lib/logger.spec.ts',
  'src/lib/logger.ts',
  'src/lib/db.spec.ts',
  'src/lib/db.ts',
  'src/middlewares/error.spec.ts',
  'src/middlewares/error.ts',
  'src/middlewares/locale.spec.ts',
  'src/middlewares/locale.ts',
  'src/middlewares/notFound.spec.ts',
  'src/middlewares/notFound.ts',
  'src/middlewares/pagination.spec.ts',
  'src/middlewares/pagination.ts',
  'src/router/index.ts',
  'src/helpers/error.ts',
  'src/helpers/cookie.spec.ts',
  'src/helpers/cookie.ts',
  'src/helpers/math.spec.ts',
  'src/helpers/math.ts',
  'src/helpers/locale.spec.ts',
  'src/helpers/locale.ts',
  'src/helpers/entity.ts',
  'src/helpers/db.ts',
  'src/bin/www.ts',
  'src/models/Migration.ts',
  'src/models/Tenant.ts',
  'src/controllers/Health.ts',
];

export default
class TemplateGenerator extends BaseTemplateGenerator {
  engine:Environment = null;

  constructor() {
    super();
    this.engine = PocketArchitect.getTemplateEngine(`${__dirname}/../templates`);
  }

  public async prepareFiles(project: Project) {
    const packageJson = JSON.parse(await fs.readFile('templates/files/backend/package.json', 'utf8'));
    packageJson.name = project.metadata.name;
    packageJson.version = '0.0.0'; // project.metadata.version;
    const files:ContentFile[] = [{
      path: `../package.json`,
      content: JSON.stringify(packageJson, null, 2)
    }, {
      path: `../tsconfig.json`,
      content: await fs.readFile('templates/files/backend/tsconfig.json', 'utf8')
    }, {
      path: `../tsconfig.release.json`,
      content: await fs.readFile('templates/files/backend/tsconfig.release.json', 'utf8')
    }];
    for (const file of TEMPLATE_INITIAL_FILES) {
      files.push({
        path: `${file}`,
        content: await fs.readFile(`templates/files/backend/${file}`, 'utf8')
      })
    }

    // models
    for (const entity of project.parts.filter(p => p.type === ApplicationType.Entity)) {
      files.push({
        path: `src/models/${entity.name}.ts`,
        content: this.engine.render('model.twig', entity)
      });
    }

    // repositories
    for (const entity of project.parts.filter(p => p.type === ApplicationType.Entity)) {
      files.push({
        path: `src/repository/${entity.name}Repo.ts`,
        content: this.engine.render('repository.twig', entity)
      });
    }

    // validators
    for (const entity of project.parts.filter(p => p.type === ApplicationType.Entity)) {
      files.push({
        path: `src/definitions/${entity.name}.ts`,
        content: this.engine.render('definition.twig', entity)
      });
    }
    return files;
  }
}
