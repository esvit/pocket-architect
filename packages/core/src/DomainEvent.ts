import {EntityId} from "./EntityId";
import {AggregateRoot} from "./AggregateRoot";

export abstract class DomainEvent<H> {
  static EVENT_NAME: string;

  readonly aggregate: AggregateRoot<any, H, any>;
  readonly aggregateId: H;
  readonly eventId: EntityId<H>;
  readonly occurredOn: Date;
  readonly eventName: string;

  constructor(aggregate: AggregateRoot<any, H, any>, eventId?: EntityId<H>, occurredOn?: Date) {
    var event = <typeof DomainEvent>this.constructor;
    this.eventName = event.EVENT_NAME;
    this.eventId = eventId || new EntityId<H>();
    this.aggregate = aggregate;
    this.aggregateId = aggregate.id;
    this.occurredOn = occurredOn || new Date();
  }

  abstract toPrimitives(): DomainEventAttributes;
}

export type AnyDomainEvent = DomainEvent<any>;
export type DomainEventClass = typeof DomainEvent<any>;

type DomainEventAttributes = any;
