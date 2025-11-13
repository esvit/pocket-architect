import {createSnapshot} from "./helpers";
import {EntityId} from "./EntityId";
import {Entity} from "./Entity";

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

  toSnapshot():never {
    return {
      ...this.props,
      testId: undefined
    } as never;
  }
}

describe('helpers', () => {
  test('createSnapshot', async () => {
    const original = {
      a: 1,
      b: 'test',
      c: {
        d: 2,
        e: 'nested',
        f: {
          g: 3
        }
      },
      id: new EntityId<string>('1'),
    };
    const snapshot = createSnapshot(original);
    expect(snapshot).toEqual(original);
    expect(snapshot).not.toBe(original);
    expect(snapshot.c).not.toBe(original.c);
    expect(snapshot.c.f).not.toBe(original.c.f);
    expect(snapshot.id).not.toBe(original.id);
    expect(snapshot.id).toEqual(new EntityId<string>('1'));

    const item = TestEntity.create({
      name: 'test',
      testId: new EntityId('2')
    }, '2');
    const itemSnapshot = createSnapshot(item);
    expect(itemSnapshot).toEqual({
      name: 'test',
      testId: undefined
    });
  });
});
