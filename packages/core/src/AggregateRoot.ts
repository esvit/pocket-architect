import { Entity } from './Entity';
import { EntityId } from './EntityId';

export abstract class AggregateRoot<T, E, H extends EntityId<E>> extends Entity<T, E, H> {

}
