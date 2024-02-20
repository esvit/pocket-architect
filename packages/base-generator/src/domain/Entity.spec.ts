import { Entity, IEntity } from './Entity';
import {LayerType} from "./Layer";
import {RelationType} from "./Relation";
import {Project} from "./Project";
import {ArchitectureType, TenancyType} from "./Metadata";

describe('Entity', () => {
  test('load', async () => {
    const entity = Entity.create({
      id: '1',
      name: 'MyEntity',
      type: LayerType.Entity,
      attributes: [
        { name: 'id', type: 'string' },
        { name: 'name', type: 'string' },
      ],
    }, null);
    expect(entity.name).toEqual('MyEntity');
    expect(entity.dependencies).toEqual([
      { part: entity.interface, names: ['IMyEntity'] }
    ]);
    expect(() => entity.layers).toThrow('Entity MyEntity does not have layers');

    // interface
    expect(entity.interface.name).toEqual('IMyEntity');
    expect(entity.interface.dependencies).toEqual([
    ]);
    expect(entity.interface.boundedContext).toEqual(entity.boundedContext);
    expect(() => entity.interface.layers).toThrow('Interface IMyEntity does not have layers');

    // repository
    expect(entity.repository.name).toEqual('MyEntityRepo');
    expect(entity.repository.dependencies).toEqual([
      { part: entity.repository.interface, names: ['IMyEntityRepo'] },
      { part: entity, names: ['MyEntity'] }
    ]);
    expect(() => entity.repository.layers).toThrow('Repository MyEntityRepo does not have layers');

    // // // service
    expect(entity.service.name).toEqual('MyEntityService');
    expect(entity.service.dependencies).toEqual([
      { part: entity, names: ['MyEntity'] },
      { part: entity.repository, names: ['IMyEntityRepo'] }
    ]);
    expect(() => entity.service.layers).toThrow('Service MyEntityService does not have layers');
  });

  test('create', async () => {
    const valueObjectProps:IEntity = {
      id: '1',
      name: 'test',
      type: LayerType.Entity,
      attributes: [],
      relations: [
        { name: 'test', type: RelationType.OneToOne, entity: 'Item', ref: 'test' }
      ]
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
      layers: []
    });
    const valueObject = Entity.create(valueObjectProps, project);
    expect(valueObject.relations[0].toJSON()).toEqual({ name: 'test', type: RelationType.OneToOne, entity: 'Item', ref: 'test' });
  });
});
