import { Entity } from './Entity';
import { EntityId } from './EntityId';

interface TestProps {
  name: string;
  testId?: EntityId<string>;
}
class TestEntity extends Entity<TestProps, string, EntityId<string>> {
  static create(props: TestProps, id?:EntityId<string>|string): TestEntity {
    return new TestEntity(props, id);
  }

  set name(name: string) {
    this.props.name = name;
  }

  set testId(val: EntityId<string>) {
    this.props.testId = val;
  }
}

describe('Entity', () => {
  let entity: TestEntity;

  beforeAll(() => {
    entity = TestEntity.create({ name: 'test', testId: new EntityId('1') }, '1');
  });

  test('base', async () => {
    const entityNew = TestEntity.create({ name: 'test2' });
    expect(entityNew.id.toString().length).toEqual(36); // random id

    const entity2 = TestEntity.create({ name: 'test2' }, '1');
    expect(entity.equals(entity2)).toBeTruthy(); // same id
    expect(entity.equals(entity)).toBeTruthy(); // same instance
    expect(entity.equals(null)).toBeFalsy(); // null
    expect(entity.equals(<TestEntity>{ id: new EntityId('1') })).toBeFalsy(); // not Entity
    expect(entity.id.toPrimitive()).toEqual('1');
    expect(entity.id.toString()).toEqual('6061cf31-edcb-5d22-9adc-927af7c186fa');

    const entity3 = TestEntity.create({ name: 'test2' }, entity.id);
    expect(entity.equals(entity3)).toBeTruthy(); // same id
    expect(entity3.id.toPrimitive()).toEqual('1');
    expect(entity3.id.toString()).toEqual('6061cf31-edcb-5d22-9adc-927af7c186fa');
  });

  test('snapshot', async () => {
    const snapshot = entity.snapshot();
    expect(snapshot).toEqual({ name: 'test', testId: new EntityId('1') });

    expect(() => {
      snapshot.name = 'changed';
    }).toThrow()
    expect(entity.isDirty()).toEqual(false);
    expect(entity.snapshotDiff()).toEqual(null);
    entity.name = 'test changed';
    expect(entity.isDirty()).toEqual(true);
    expect(entity.snapshotDiff()).toEqual({"name": "test changed"});
  });
});
