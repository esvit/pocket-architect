import { EventEmitter } from 'events';
import { AnyDomainEvent } from '../DomainEvent';
import { EventBus } from '../EventBus';
import {DomainEventSubscriber} from "../DomainEventSubscriber";

export class InMemoryEventBus implements EventBus {
  protected _events: AnyDomainEvent[] = [];
  protected _emitter: EventEmitter;

  constructor() {
    this._emitter = new EventEmitter();
  }

  async push(event: AnyDomainEvent): Promise<void> {
    this._events.push(event);
  }

  async clear(): Promise<void> {
    this._events = [];
  }

  async publish(events: AnyDomainEvent[] = []): Promise<void> {
    const allEvents = (this._events || []).concat(events ?? []);
    for (const event of allEvents) {
      this._emitter.emit(event.eventName, event);
    }
    await this.clear();
  }

  on(event: string, listener: (...args: never[]) => void): void {
    this._emitter.on(event, listener);
  }

  listenerCount(event: string): number {
    return this._emitter.listenerCount(event);
  }

  addSubscribers(subscribers: DomainEventSubscriber[] | DomainEventSubscriber): void {
    const subsArray = Array.isArray(subscribers) ? subscribers : [subscribers];
    for (const subscriber of subsArray) {
      const events = subscriber.subscribedTo();
      for (const event of events) {
        this._emitter.on(event.EVENT_NAME ?? event.name, subscriber.on.bind(subscriber));
      }
    }
  }
}
