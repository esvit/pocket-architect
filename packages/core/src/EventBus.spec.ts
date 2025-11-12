import {InMemoryEventBus} from "./eventBus/InMemoryEventBus";
import {DomainEventSubscriber} from "./DomainEventSubscriber";
import {DomainEvent, DomainEventClass} from "./DomainEvent";
import {EntityId} from "./EntityId";
import {Entity} from "./Entity";

describe('EventBus', () => {
  class NewUserCreated extends DomainEvent<{ username: string }> {
  }
  class NewUserCreated2 extends DomainEvent<{ username: string }> {
    static EVENT_NAME = 'Event2';
  }

  class NewUserSubscriber implements DomainEventSubscriber {
    subscribedTo(): DomainEventClass[] {
      return [NewUserCreated, NewUserCreated2];
    }
    async on(domainEvent: NewUserCreated|NewUserCreated2): Promise<void> {
      console.log('Event received:', domainEvent);
    }
  }

  test('lifecycle', async () => {
    const newUserSubscriber = new NewUserSubscriber();
    newUserSubscriber.on = jest.fn();
    const hub = new InMemoryEventBus();
    hub.addSubscribers([newUserSubscriber]);

    const event = new NewUserCreated({ username: 'test' });
    const event2 = new NewUserCreated2({ username: 'test2' });

    expect(event.eventName).toEqual('NewUserCreated');
    expect(event2.eventName).toEqual('Event2');

    await hub.publish([event, event2]);

    expect(newUserSubscriber.on).toHaveBeenCalledTimes(2);
  });

  test('user example', async () => {
    class UserId extends EntityId<string> {}

    interface IUser {
      id: UserId;
      username: string;
    }

    class User extends Entity<IUser, string, UserId> {
      static create(props: IUser): User {
        return new User(props, props.id);
      }

      set username(username: string) {
        this.props.username = username;
      }

      get username(): string {
        return this.props.username;
      }
    }

    class UserCreatedEvent extends DomainEvent<Partial<IUser>> {
      readonly eventName = 'UserCreatedEvent'; // без цього не буде працювати статична типізація

      get username() {
        return this.props.username;
      }
    }

    class ChangeLoggerSubscriber implements DomainEventSubscriber {
      // Підписуємося на події, які нас цікавлять
      subscribedTo() {
        return [UserCreatedEvent];
      }

      // Реалізуємо логіку обробки подій
      async on(domainEvent: UserCreatedEvent) {
        console.log('Username changed:', domainEvent.username);
      }
    }

    // Далі створюємо EventBus і реєструємо підписника
    const eventBus = new InMemoryEventBus();
    const subscriber = new ChangeLoggerSubscriber();
    const mockOn = jest.spyOn(subscriber, 'on');
    eventBus.addSubscribers([subscriber]);

    const user = User.create({ id: new UserId('1'), username: 'john_doe' });
    // Створюємо знімок початкового стану
    user.snapshot();
    // Змінюємо ім'я користувача
    user.username = 'john_doe_updated';
    let event;
    // Перевіряємо, чи є зміни
    if (user.isDirty()) {
      const diff = user.snapshotDiff();
      if (diff) {
        event = new UserCreatedEvent(diff);
        // записуємо подію в чергу (не publish). Бо якщо в циклі може бути багато подій і їх треба назбирати, а потім виконати, тому збираємо через push
        eventBus.push(event);
      }
    }
    expect(mockOn).not.toHaveBeenCalled();
    // Публікуємо всі події в черзі
    await eventBus.publish();
    expect(mockOn).toHaveBeenCalledWith(event);
  });
});
