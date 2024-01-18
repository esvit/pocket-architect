import PocketArchitect from './PocketArchitect';
import {LayerType} from './domain/Layer';

describe('PocketArchitect', () => {
  test('load', async () => {
    const project = await PocketArchitect.load(`${__dirname}/../../../.pocket-architect.json5`);
    // await PocketArchitect.write(`${__dirname}/../../../.pocket-architect.json`, res);

    expect(project.layers[0].context).toBeDefined();
    expect(project.layers[0].parent).toEqual(null);
    expect(project.layers[0].type).toEqual(LayerType.Domain);
    expect(project.layers[0].layers[0].domain).toEqual(project.layers[0]);
    expect(project.layers[0].layers[0].layers[0].domain).toEqual(project.layers[0]);
    expect(project.layers[0].layers[0].parent).toEqual(project.layers[0]);
    expect(project.layers[0].layers[0].layers[0].parent).toEqual(project.layers[0].layers[0]);
    expect(project.layers[0].layers[0].layers[0].path).toEqual([
      project.layers[0],
      project.layers[0].layers[0],
      project.layers[0].layers[0].layers[0],
    ]);

    expect(project.layers[0].layers[0].name).toEqual('applications');
    expect(project.layers[0].layers[0].domain.name).toEqual('main');
    expect(project.metadata.name).toEqual('MyApp');
    expect(project.layers[0].name).toEqual('main');
    expect(project.layers[1].name).toEqual('SecondDomain');
    expect(project.layers[1].folderName).toEqual('second-domain');
  });
});
