#!/usr/bin/env node
import TemplateGenerator from './TemplateGenerator';
import { getCommander } from '@pocket-architect/base-generator';

(async function () {
  await getCommander('pa-generator-koa', new TemplateGenerator()).parseAsync(process.argv);
})();
