import {EntityId} from "./EntityId";
import {AnyAggregateRoot} from "./AggregateRoot";

export abstract class DomainEvent<H> {
  static EVENT_NAME: string;

  readonly aggregate: AnyAggregateRoot<H>;
  readonly aggregateId: H;
  readonly eventId: EntityId<H>;
  readonly occurredOn: Date;
  readonly eventName: string;

  constructor(aggregate: AnyAggregateRoot<H>, eventId?: EntityId<H>, occurredOn?: Date) {
    const event = <typeof DomainEvent>this.constructor;
    this.eventName = event.EVENT_NAME;
    this.eventId = eventId || new EntityId<H>();
    this.aggregate = aggregate;
    this.aggregateId = aggregate.id;
    this.occurredOn = occurredOn || new Date();
  }

  abstract toPrimitives(): DomainEventAttributes;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AnyDomainEvent = DomainEvent<any>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type DomainEventClass = typeof DomainEvent<any>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type DomainEventAttributes = any;
