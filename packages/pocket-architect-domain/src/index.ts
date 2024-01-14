import { program } from 'commander';
import TemplateGenerator, { TemplateGeneratorOptions } from './TemplateGenerator';
import { constants, promises as fs } from 'fs';

(async function () {
  program.command('generate')
    .description('Generate code from pocket architect file')
    .argument('<file>', 'Pocket architect file (*.json5)')
    .option('-m, --module <moduleName>')
    .option('-s, --service <serviceName>')
    .option('-o, --output-dir <dir>', 'Output folder', 'dist')
    .action(async (str, options:TemplateGeneratorOptions) => {
      const generator = new TemplateGenerator(options);
      try {
        await fs.access(str, constants.R_OK);
      } catch (err) {
        throw new Error(`File "${this.inputFile}" does not exist or is not readable`);
      }
      const { outputDir } = options;
      try {
        await fs.mkdir(outputDir, { recursive: true });
      } catch (err) {
        throw new Error(`Ouput folder "${outputDir}" does not exist or is not writable`);
      }
      await generator.generate(str, outputDir);
    })

  program.parse();
})();
