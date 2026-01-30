import { Entity } from './Entity';
import { EntityId } from './EntityId';
import {DiffFormatterOptions} from "./helpers/diff";

interface TestProps {
  name: string;
  testId?: EntityId<string>;
  test2: TestEntity2;
  parts: {
    amount: number;
    entity: TestEntity2;
  }[];
}
interface TestProps2 {
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

  setFirstAmount(amount:number):void {
    this.props.parts[0].amount = amount;
  }

  toDiff(): DiffFormatterOptions | null {
    return {
      resolveLabel({ key, index, path }) {
        if (key === 'createdAt') return null; // ignore

        if (key === 'amount' && index !== null) return `Ціна (позиція ${index + 1})`;
        if (path === 'name') return 'Імʼя';

        return undefined;
      },
      formatValue(value, { key }) {
        if (value instanceof EntityId) {
          return value.toHash();
        }
        if (key === 'amount' && typeof value === 'number') return `${value.toFixed(2)} грн`;
        return String(value);
      },
    };
  }
}
class TestEntity2 extends Entity<TestProps2, string, EntityId<string>> {
  static create(props: TestProps2, id?:EntityId<string>|string): TestEntity2 {
    return new TestEntity2(props, id);
  }
}

describe('Entity', () => {
  let entity: TestEntity;

  beforeAll(() => {
    entity = TestEntity.create({
      name: 'test', testId: new EntityId('1'),
      test2: TestEntity2.create({ name: 'test', testId: new EntityId('1') }),
      parts: [{
        amount: 1000,
        entity: TestEntity2.create({ name: 'part entity', testId: new EntityId('2') })
      }]
    }, '1');
  });

  test('base', async () => {
    const entityNew = TestEntity.create({
      name: 'test2',
      test2: TestEntity2.create({ name: 'test', testId: new EntityId('1') }),
      parts: []
    });
    expect(entityNew.id.toString().length).toEqual(36); // random id

    const entity2 = TestEntity.create({
      name: 'test2',
      test2: TestEntity2.create({ name: 'test', testId: new EntityId('1') }),
      parts: []
    }, '1');
    expect(entity.equals(entity2)).toBeTruthy(); // same id
    expect(entity.equals(entity)).toBeTruthy(); // same instance
    expect(entity.equals(null)).toBeFalsy(); // null
    expect(entity.equals(<TestEntity>{ id: new EntityId('1') })).toBeFalsy(); // not Entity
    expect(entity.id.toPrimitive()).toEqual('1');
    expect(entity.id.toString()).toEqual('6061cf31-edcb-5d22-9adc-927af7c186fa');

    const entity3 = TestEntity.create({
      name: 'test2',
      test2: TestEntity2.create({ name: 'test', testId: new EntityId('1') }),
      parts: []
    }, entity.id);
    expect(entity.equals(entity3)).toBeTruthy(); // same id
    expect(entity3.id.toPrimitive()).toEqual('1');
    expect(entity3.id.toString()).toEqual('6061cf31-edcb-5d22-9adc-927af7c186fa');
  });

  test('snapshot', async () => {
    const snapshot = entity.snapshot();
    expect(snapshot).toEqual({
      "name": "test",
      "parts": [
        {
          "amount": 1000,
          "entity": {
            "name": "part entity",
            "testId": "QbPvX"
          }
        }
      ],
      "test2": {
        "name": "test",
        "testId": "3D4WX"
      },
      "testId": "3D4WX"
    });

    expect(() => {
      snapshot.name = 'changed';
    }).toThrow()
    expect(entity.isDirty()).toEqual(false);
    expect(entity.snapshotDiff()).toEqual([]);
    entity.name = 'test changed';
    entity.setFirstAmount(200);
    expect(entity.isDirty()).toEqual(true);
    expect(entity.snapshotDiff()).toEqual([
      {
        "after": "test changed",
        "afterRaw": "test changed",
        "before": "test",
        "beforeRaw": "test",
        "index": null,
        "kind": "changed",
        "label": "Імʼя",
        "path": "name"
      },
      {
        "after": "200.00 грн",
        "afterRaw": 200,
        "before": "1000.00 грн",
        "beforeRaw": 1000,
        "index": 0,
        "kind": "changed",
        "label": "Ціна (позиція 1)",
        "path": "parts[0].amount"
      }
    ]);
  });
});
