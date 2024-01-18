import { Entity } from './Entity';
import {LayerType} from "./Layer";

describe('Entity', () => {
  test('load', async () => {
    const entity = Entity.create({
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
    expect(entity.interface.context).toEqual(entity.context);
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
});
