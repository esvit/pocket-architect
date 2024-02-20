import { Entity } from './Entity';
import { EntityId } from './EntityId';

export abstract class AggregateRoot<T, H extends EntityId> extends Entity<T, H> {

}
