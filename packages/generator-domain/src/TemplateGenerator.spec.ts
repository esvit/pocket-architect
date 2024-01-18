import TemplateGenerator from './TemplateGenerator';
import {
  Project,
  LayerType, TenancyType,
  ArchitectureType
} from '@pocket-architect/base-generator';

describe('TemplateGenerator', () => {
  let generator;
  let project;

  beforeEach(() => {
    project = Project.create({
      metadata: { name: 'test', initialVersion: '0.0.0', version: '0.0.0', architectureType: ArchitectureType.Multiservices, tenancyType: TenancyType.MultiTenants },
      layers: [{
        name: 'main', type: LayerType.Context
      }, {
        name: 'test', type: LayerType.Entity, parent: 'main'
      }]
    });
    generator = new TemplateGenerator();
  });

  test('generate', async () => {
    const files = await generator.prepareFiles(project);
    expect(files).toEqual('MyApp');
    // expect(res.parts[0].name).toEqual('main');
    // expect(res.parts[1].name).toEqual('webservice1');
    //
    // expect(res.parts[0].parts[0].name).toEqual('applications');
  });
});
