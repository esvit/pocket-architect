import {AnyDomainEvent} from './DomainEvent';
import {DomainEventSubscriber} from "./DomainEventSubscriber";

export interface EventBus {
  publish(events: AnyDomainEvent[]): Promise<void>;
  addSubscribers(subscribers: DomainEventSubscriber[]): void;
}
