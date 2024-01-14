#!/usr/bin/env node
import TemplateGenerator from './TemplateGenerator';
import { getCommander } from '@pocket-architect/base-generator';

(async function () {
  await getCommander('pa-generator-domain', new TemplateGenerator()).parseAsync(process.argv);
})();
