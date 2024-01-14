import { Entity } from './Entity';

interface TestProps {
  name: string;
}
class TestEntity extends Entity<TestProps> {
  static create(props: TestProps, id?:string): TestEntity {
    return new TestEntity(props, id);
  }
}

describe('Entity', () => {
  let entity: TestEntity;

  beforeAll(() => {
    entity = TestEntity.create({ name: 'test' }, '1');
  });

  test('base', async () => {
    const entityNew = TestEntity.create({ name: 'test2' });
    expect(entityNew.id.length).toEqual(36); // random id

    const entity2 = TestEntity.create({ name: 'test2' }, '1');
    expect(entity.equals(entity2)).toBeTruthy(); // same id
    expect(entity.equals(entity)).toBeTruthy(); // same instance
    expect(entity.equals(null)).toBeFalsy(); // null
    expect(entity.equals(<TestEntity>{ id: '1' })).toBeFalsy(); // not Entity
    expect(entity.id).toEqual('1');
  });
});
