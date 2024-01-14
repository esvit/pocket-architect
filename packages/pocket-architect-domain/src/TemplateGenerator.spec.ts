import TemplateGenerator from './TemplateGenerator';
import {Project} from 'pocket-architect-lib/src/domain/Project';
import {ArchitectureType, TenancyType} from 'pocket-architect-lib/src/domain/Metadata';
import {ApplicationType} from 'pocket-architect-lib/src/domain/ApplicationPart';

describe('TemplateGenerator', () => {
  let generator;
  let project;

  beforeEach(() => {
    project = Project.create({
      metadata: { name: 'test', initialVersion: '0.0.0', version: '0.0.0', architectureType: ArchitectureType.Multiservices, tenancyType: TenancyType.MultiTenants },
      parts: [{
        name: 'main', type: ApplicationType.Module
      }, {
        name: 'test', type: ApplicationType.Entity, parent: 'main'
      }]
    });
    generator = new TemplateGenerator({});
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
