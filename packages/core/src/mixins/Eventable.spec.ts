import { Event, Eventable } from './Eventable';

interface MyEventPayload {
  message: string;
}

class MyDomainEntity {
}
const EventableMyDomainEntity = Eventable<MyEventPayload>()(MyDomainEntity);

describe('Eventable', () => {
  let entity: InstanceType<typeof EventableMyDomainEntity>;

  beforeAll(() => {
    entity = new EventableMyDomainEntity();
  });

  test('base', async () => {
    const event = new Event<MyEventPayload>({ message: 'hello' });
    entity.registerEvent(event);

    expect(entity.releaseEvents()).toEqual([event]);
    expect(entity.releaseEvents()).toEqual([]);
  });
});
