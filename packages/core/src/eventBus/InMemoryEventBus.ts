import { EventEmitter } from 'events';
import { AnyDomainEvent } from '../DomainEvent';
import { EventBus } from '../EventBus';
import {DomainEventSubscriber} from "../DomainEventSubscriber";

export class InMemoryEventBus extends EventEmitter implements EventBus {
  protected _events: AnyDomainEvent[] = [];

  async push(event: AnyDomainEvent): Promise<void> {
    this._events.push(event);
  }

  async clear(): Promise<void> {
    this._events = [];
  }

  async publish(events: AnyDomainEvent[] = []): Promise<void> {
    const allEvents = (this._events || []).concat(events ?? []);
    for (const event of allEvents) {
      this.emit(event.eventName, event);
    }
    await this.clear();
  }

  addSubscribers(subscribers: DomainEventSubscriber[]): void {
    for (const subscriber of subscribers) {
      const events = subscriber.subscribedTo();
      for (const event of events) {
        this.on(event.EVENT_NAME ?? event.name, subscriber.on.bind(subscriber));
      }
    }
  }
}
