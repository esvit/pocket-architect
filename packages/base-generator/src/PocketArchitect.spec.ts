import PocketArchitect from './index';
import {SchemaObjectType} from './domain/SchemaObject';

describe('PocketArchitect', () => {
  test('load', async () => {
    const project = await PocketArchitect.load(`${__dirname}/../../../.pocket-architect.json5`);
    const { schema } = project;

    expect(schema.objects[0].boundedContext).toBeDefined();
    expect(schema.objects[0].parent).toEqual(null);
    expect(schema.objects[0].type).toEqual(SchemaObjectType.Domain);
    expect(schema.objects[0].objects[0].domain.equals(schema.objects[0])).toBeTruthy();
    expect(schema.objects[0].objects[0].parent).toEqual(schema.objects[0]);
    expect(schema.objects[0].objects[0].objects[0].parent).toEqual(schema.objects[0].objects[0]);
    expect(schema.objects[0].objects[0].objects[0].path).toEqual([
      schema.objects[0],
      schema.objects[0].objects[0],
      schema.objects[0].objects[0].objects[0],
    ]);

    expect(schema.objects[0].objects[0].name).toEqual('applications');
    expect(schema.objects[0].objects[0].domain.name).toEqual('main');
    expect(project.metadata.name).toEqual('MyApp');
    expect(schema.objects[0].name).toEqual('main');
    expect(schema.objects[1].name).toEqual('SecondDomain');
    expect(schema.objects[1].folderName).toEqual('second-domain');
  });
});
