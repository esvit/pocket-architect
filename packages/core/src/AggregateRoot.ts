import { Entity } from './Entity';
import { EntityId } from './EntityId';
import {DomainEvent} from "./DomainEvent";

export abstract class AggregateRoot<T, E, H extends EntityId<E>> extends Entity<T, E, H> {
  private _domainEvents: DomainEvent<E>[] = [];

  pullDomainEvents(): DomainEvent<E>[] {
    const domainEvents = this._domainEvents.slice();
    this._domainEvents = [];
    return domainEvents;
  }

  pushDomainEvent(event: DomainEvent<E>): void {
    this._domainEvents.push(event);
  }
}
