import { program, Command } from 'commander';
import {constants, promises as fs} from 'fs';
import path from 'path';
import PocketArchitect from './PocketArchitect';

export type TemplateGeneratorOptions = {
  module?: string;
  service?: string;
  outputDir?: string;
};

export type ContentFile = {
  path: string;
  content: string;
}

export function getCommander(name:string, generator:BaseTemplateGenerator):Command {
  return program
    .name(name)
    .description('Generate code from pocket architect file')
    .argument('[file]', 'Pocket architect file (*.json5)', '.pocket-architect.json5')
    .option('-m, --module <moduleName>')
    .option('-s, --service <serviceName>')
    .option('-o, --output-dir <dir>', 'Output folder', 'src')
    .action(async (str, options:TemplateGeneratorOptions):Promise<void> => {
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
      generator.setOptions(options);
      await generator.generate(str, outputDir);
    });
}

export default
abstract class BaseTemplateGenerator {
  protected options:TemplateGeneratorOptions = {};

  abstract prepareFiles(project:PocketArchitect):Promise<ContentFile[]>;

  setOptions(options:TemplateGeneratorOptions):void {
    this.options = options;
  }

  public async generate(inputFile:string, outputDir:string):Promise<ContentFile[]> {
    const project = await PocketArchitect.load(inputFile);
    const files = await this.prepareFiles(project);
    await this.writeFiles(files, outputDir);
    return files;
  }

  protected async writeFiles(files:ContentFile[], outputDir:string):Promise<void> {
    await fs.rm(outputDir, { recursive: true, force: true });
    for (const file of files) {
      const fullpath = `${outputDir}/${file.path}`
      await fs.mkdir(path.dirname(fullpath), { recursive: true });
      await fs.writeFile(fullpath, file.content);
    }
  }
}
