import {InMemoryEventBus} from "./InMemoryEventBus";
import {DomainEvent, DomainEventClass} from "../DomainEvent";
import {EntityId} from "../EntityId";
import {DomainEventSubscriber} from "../DomainEventSubscriber";
import {AggregateRoot} from "../AggregateRoot";

interface ITestAggregate {}

class TestAggregate extends AggregateRoot<ITestAggregate, number, EntityId<number>> {
  static create(props: ITestAggregate, id?:EntityId<number>|number): TestAggregate {
    return new TestAggregate(props, id);
  }
}

class TestEvent extends DomainEvent<TestAggregate> {
  static EVENT_NAME = 'TestEvent';
}

class TestSubscriber implements DomainEventSubscriber {
  subscribedTo():DomainEventClass[] {
    return [TestEvent];
  }

  on(event:TestEvent):Promise<void> {
    console.info(event);
    return Promise.resolve();
  }
}

jest.mock('events', () => {
  return {
    EventEmitter: class {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      listeners: any = {};

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      on(event: string, listener: any) {
        this.listeners[event] = listener;
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      emit(event: string, ...args: any[]) {
        this.listeners[event](...args);
      }

      listenerCount(event: string) {
        return this.listeners[event] ? 1 : 0;
      }
    }
  };
});

describe('InMemoryEventBus', () => {
  let bus: InMemoryEventBus;
  let aggregate: TestAggregate;

  beforeEach(() => {
    bus = new InMemoryEventBus();
    aggregate = TestAggregate.create({}, new EntityId(1));
  });

  test('publish', async () => {
    const event = new TestEvent(aggregate);
    const mock = jest.fn();
    bus.on('TestEvent', mock);
    await bus.publish([event]);
    expect(bus.listenerCount('TestEvent')).toBe(1);
    expect(mock).toHaveBeenCalledWith(event);
  });

  test('addSubscribers', async () => {
    const subscriber = new TestSubscriber();
    subscriber.on = jest.fn();
    bus.addSubscribers([subscriber]);

    const event = new TestEvent(aggregate);
    await bus.publish([event]);
    expect(bus.listenerCount('TestEvent')).toBe(1);
    expect(subscriber.on).toHaveBeenCalledWith(event);
  });
});
