import createUUID from 'uuid-by-string'
import { createId } from '@paralleldrive/cuid2'

const isEntity = <T>(v: Entity<T>): v is Entity<T> => {
  return v instanceof Entity
}

export type EntityId = string;

export abstract class Entity<T> {
  protected readonly _id: EntityId;
  protected props: T

  protected constructor(props: T, id?: EntityId) {
    this._id = id ? id : createUUID(createId(), createUUID(this.constructor.name));
    this.props = props
  }

  public equals(object?: Entity<T>): boolean {
    if (object === null || object === undefined) {
      return false
    }

    if (this === object) {
      return true
    }

    if (!isEntity(object)) {
      return false
    }

    return this._id == object._id
  }

  get id(): EntityId {
    return this._id
  }
}
