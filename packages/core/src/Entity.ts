import { EntityId } from './EntityId';

const isEntity = <T, H extends EntityId>(v: Entity<T, H>): v is Entity<T, H> => {
  return v instanceof Entity
}

export abstract class Entity<T, H extends EntityId> {
  protected readonly _id: H;
  protected props: T;

  protected constructor(props: T, id?: H|string|number) {
    if (id) {
      this._id = <H>(typeof id === 'object' ? id : new EntityId(id));
    } else {
      this._id = <H>(new EntityId());
    }
    this.props = props
  }

  public equals(object?: Entity<T, H>): boolean {
    if (object === null || object === undefined) {
      return false
    }

    if (this === object) {
      return true
    }

    if (!isEntity(object)) {
      return false
    }

    return this._id.equals(object._id);
  }

  get id(): H {
    return this._id
  }

  toPrimitive(): T {
    return this.props
  }

  toJSON(): T {
    return this.toPrimitive()
  }
}
