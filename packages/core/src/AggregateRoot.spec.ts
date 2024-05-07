import {AggregateRoot} from "./AggregateRoot";
import {EntityId} from "./EntityId";
import {DomainEvent} from "./DomainEvent";

interface TestProps {
  name: string;
}
class TestEntity extends AggregateRoot<TestProps, number, EntityId<number>> {
  static create(props: TestProps, id?:EntityId<number>|number): TestEntity {
    return new TestEntity(props, id);
  }
}
class TestEvent extends DomainEvent<number> {
  readonly eventName = 'TestEvent';

  toPrimitives() {
    return {};
  }
}

describe('AggregateRoot', () => {
  let root: TestEntity;

  beforeAll(() => {
    root = TestEntity.create({ name: 'test' }, 1);
  });

  test('events', async () => {
    const event = new TestEvent(root);
    root.pushDomainEvent(event);

    expect(root.pullDomainEvents()).toEqual([event]);
    expect(root.pullDomainEvents()).toEqual([]);
  });
});
