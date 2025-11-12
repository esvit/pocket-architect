import {AnyDomainEvent} from './DomainEvent';
import {DomainEventSubscriber} from "./DomainEventSubscriber";

export interface EventBus {
  push(event: AnyDomainEvent): Promise<void>;
  clear(): Promise<void>;
  publish(events: AnyDomainEvent[]): Promise<void>;
  addSubscribers(subscribers: DomainEventSubscriber[]): void;
}
