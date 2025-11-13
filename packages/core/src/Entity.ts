import { EntityId } from './EntityId';

const isEntity = <T, E, M extends EntityId<E>>(v: Entity<T, E, M>): v is Entity<T, E, M> => {
  return v instanceof Entity
}

export abstract class Entity<T, E, H extends EntityId<E>> {
  protected readonly _id: H;
  protected props: T;
  protected _snapshot: string;

  snapshot(): T {
    this._snapshot = JSON.stringify(this.props);
    const copy = JSON.parse(this._snapshot) as T;
    Object.freeze(copy);
    return copy;
  }

  snapshotDiff(): Partial<T> | null {
    if (!this._snapshot) {
      return null;
    }
    const diffs: Partial<T> = {};
    const copy = JSON.parse(this._snapshot);
    for (const key in this.props) {
      if (JSON.stringify(this.props[key]) !== JSON.stringify(copy[key])) {
        diffs[key] = this.props[key];
      }
    }
    return Object.keys(diffs).length > 0 ? diffs : null;
  }

  isDirty(): boolean {
    if (!this._snapshot) {
      return false;
    }
    return this._snapshot !== JSON.stringify(this.props);
  }

  protected constructor(props: T, id?: H|E) {
    if (id) {
      this._id = <H>(typeof id === 'object' ? id : new EntityId<E>(id));
    } else {
      this._id = <H>(new EntityId());
    }
    this.props = props
  }

  public equals(object?: Entity<T, E, H>): boolean {
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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  toJSON(): any {
    return this.toPrimitive();
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  toSnapshot(): any {
    return this.toPrimitive();
  }
}
