import {Environment} from 'nunjucks';
import { promises as fs } from 'fs';
import PocketArchitect, {
  BaseTemplateGenerator, ContentFile
} from '@pocket-architect/base-generator';

const TEMPLATE_INITIAL_FILES = [
  'index.ts',
  'types.ts',
  'libs/container.ts',
  'libs/env.ts',
  'libs/error.ts',
  'infra/logging/Logger.ts',
  'api/http/Server.ts',
  'api/http/HTTPRouter.ts',
  'api/http/middlewares/error.spec.ts',
  'api/http/middlewares/error.ts',
  'api/http/middlewares/notFound.spec.ts',
  'api/http/middlewares/notFound.ts'
];

export default
class TemplateGenerator extends BaseTemplateGenerator {
  engine:Environment = null;

  constructor() {
    super();
    this.engine = PocketArchitect.getTemplateEngine(`${__dirname}/../templates`);
  }

  public async prepareFiles():Promise<ContentFile[]> {
    const files:ContentFile[] = [];
    for (const file of TEMPLATE_INITIAL_FILES) {
      files.push({
        path: file,
        content: await fs.readFile(`${__dirname}/../templates/${file}`, 'utf8')
      })
    }
    return files;
  }
}
