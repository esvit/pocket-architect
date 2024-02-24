import { Entity, IEntity } from './Entity';
import {SchemaObjectType} from "./SchemaObject";
import {RelationType} from "./Relation";
import {Project} from "./Project";
import {ArchitectureType, TenancyType} from "./Metadata";
import {AttributeType} from "./Attribute";

describe('Entity', () => {
  test('load', async () => {
    const entity = Entity.create({
      id: '1',
      name: 'MyEntity',
      type: SchemaObjectType.Entity,
      attributes: [
        { name: 'id', type: AttributeType.String },
        { name: 'name', type: AttributeType.String },
      ],
    }, null);
    expect(entity.name).toEqual('MyEntity');
    expect(entity.dependencies).toEqual([
      { part: entity.interface, names: ['IMyEntity'] }
    ]);
    expect(() => entity.objects).toThrow('Entity MyEntity does not have layers');

    // interface
    expect(entity.interface.name).toEqual('IMyEntity');
    expect(entity.interface.dependencies).toEqual([
    ]);
    expect(entity.interface.boundedContext).toEqual(entity.boundedContext);
    expect(() => entity.interface.objects).toThrow('Interface IMyEntity does not have layers');

    // repository
    expect(entity.repository.name).toEqual('MyEntityRepo');
    expect(entity.repository.dependencies).toEqual([
      { part: entity.repository.interface, names: ['IMyEntityRepo'] },
      { part: entity, names: ['MyEntity'] }
    ]);
    expect(() => entity.repository.objects).toThrow('Repository MyEntityRepo does not have layers');

    // // // service
    expect(entity.service.name).toEqual('MyEntityService');
    expect(entity.service.dependencies).toEqual([
      { part: entity, names: ['MyEntity'] },
      { part: entity.repository, names: ['IMyEntityRepo'] }
    ]);
    expect(() => entity.service.objects).toThrow('Service MyEntityService does not have layers');
  });

  test('create', async () => {
    const valueObjectProps:IEntity = {
      id: '1',
      name: 'test',
      type: SchemaObjectType.Entity,
      attributes: []
    };
    const project = Project.create({
      metadata: {
        name: 'Test',
        version: '1.0.0',
        description: 'Test',
        initialVersion: '1.0.0',
        architectureType: ArchitectureType.Monolithic,
        tenancyType: TenancyType.SingleTenant
      },
      schema: {
        objects: [],
        relations: [
          { name: 'test', type: RelationType.OneToOne, id: '1', source: { id: '1', columnName: 'test' }, target: { id: '1', columnName: 'test' } }
        ]
      }
    });
    const valueObject = Entity.create(valueObjectProps, project.schema);
    expect(valueObject.toJSON()).toEqual({
      "attributes": [
        {
          "description": "Unique identifier for entity test",
          "id": expect.any(String),
          "mandatory": true,
          "name": "id",
          "system": true,
          "type": "id"
        }
      ],
      "id": "1",
      "name": "test",
      "type": "entity"
    });
  });
});
