import {AnyDomainEvent, DomainEventClass} from './DomainEvent';

export interface DomainEventSubscriber {
  subscribedTo(): DomainEventClass[];
  on(domainEvent: AnyDomainEvent): Promise<void>;
}
