## Entity

### Snapshots

```typescript
// Створює копію властивостей сутності у вигляді простого об'єкта.
// Також зберігає початковий стан для відстеження змін (dirty checking).
const snapshot = entity.snapshot();

entity.isDirty(); // Повертає true, якщо сутність була змінена після створення знімка.
entity.snapshotDiff(); // Повертає об'єкт з відмінностями між поточним станом сутності та знімком. Або null, якщо змін немає.
```

## Events

### EventBus

Сутність для керування подіями в системі.
В монолітних застосунках зазвичай використовується один глобальний EventBus і його можна описати за допомогою InMemoryEventBus, не потрібно залучати чергу, бо всі обробники працюють в одному процесі.

```typescript
// Спершу треба описати події, які є в домені. Для цього є клас DomainEvent, який треба наслідувати.
class UserCreatedEvent extends DomainEvent<{ userId: string; username: string }> {
  readonly eventName = 'UserCreatedEvent'; // без цього не буде працювати статична типізація
}
class UserUpdatedEvent extends DomainEvent<{ userId: string; username: string }> {
  readonly eventName = 'UserUpdatedEvent';
}

// Далі створюємо підписника на події, реалізуючи інтерфейс DomainEventSubscriber
class NewUserSubscriber implements DomainEventSubscriber {
  // Підписуємося на події, які нас цікавлять
  subscribedTo() {
    return [UserCreatedEvent, UserUpdatedEvent];
  }
  
  // Реалізуємо логіку обробки подій
  async on(domainEvent: UserCreatedEvent|UserUpdatedEvent) {
    console.log('Event received:', domainEvent);
  }
}

// Далі створюємо EventBus і реєструємо підписника
const eventBus = new InMemoryEventBus();
const subscriber = new NewUserSubscriber();
eventBus.addSubscribers([subscriber]);
const event = new UserCreatedEvent({ userId: '1', username: 'john_doe' });
const event2 = new UserUpdatedEvent({ userId: '1', username: 'john_doe_updated' });
// Публікуємо події
await eventBus.publish([event, event2]);
```

У поєднанні snapshot та EventBus можна реалізувати відстеження змін в сутностях і публікації відповідних подій.

```typescript
class UserId extends EntityId<string> {}

interface IUser {
  id: UserId;
  username: string;
}

class User extends Entity<IUser, string, UserId> {
}

class UserCreatedEvent extends DomainEvent<Partial<IUser>> {
  readonly eventName = 'UserCreatedEvent'; // без цього не буде працювати статична типізація
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
const subscriber = new NewUserSubscriber();
eventBus.addSubscribers([subscriber]);

const user = User.create({ id: new UserId('1'), username: 'john_doe' });
// Створюємо знімок початкового стану
user.snapshot();
// Змінюємо ім'я користувача
user.username = 'john_doe_updated';
// Перевіряємо, чи є зміни
if (user.isDirty()) {
  const diff = user.snapshotDiff();
  if (diff) {
    // записуємо подію в чергу (не publish). Бо якщо в циклі може бути багато подій і їх треба назбирати, а потім виконати, тому збираємо через push
    eventBus.push(new UserCreatedEvent(diff));
  }
}
// Публікуємо всі події в черзі
await eventBus.publish();
```