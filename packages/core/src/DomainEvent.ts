import {EntityId} from "./EntityId";

export abstract class DomainEvent<H> {
  static EVENT_NAME: string;

  readonly props: H;
  readonly eventId: EntityId<never>;
  readonly occurredOn: Date;
  readonly eventName: string;

  constructor(props: H, eventId?: EntityId<never>, occurredOn?: Date) {
    this.props = props;

    const event = <typeof DomainEvent>this.constructor;
    this.eventName = event.EVENT_NAME ?? this.constructor.name;
    this.eventId = eventId || new EntityId<never>();
    this.occurredOn = occurredOn || new Date();
  }

  toPrimitives(): H {
    return this.props;
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AnyDomainEvent = DomainEvent<any>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type DomainEventClass = typeof DomainEvent<any>;
