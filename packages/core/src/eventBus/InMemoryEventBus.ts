import { EventEmitter } from 'events';
import { AnyDomainEvent } from '../DomainEvent';
import { EventBus } from '../EventBus';
import {DomainEventSubscriber} from "../DomainEventSubscriber";

export class InMemoryEventBus extends EventEmitter implements EventBus {
  async publish(events: AnyDomainEvent[]): Promise<void> {
    for (const event of events) {
      this.emit(event.eventName, event);
    }
  }

  addSubscribers(subscribers: DomainEventSubscriber[]): void {
    for (const subscriber of subscribers) {
      const events = subscriber.subscribedTo();
      for (const event of events) {
        this.on(event.EVENT_NAME, subscriber.on.bind(subscriber));
      }
    }
  }
}
