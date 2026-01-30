import { EntityId } from './EntityId';
import {createSnapshot} from "./helpers";
import {buildDiffViewModel, DiffFormatterOptions, diffObjects, DiffViewModel} from "./helpers/diff";

const isEntity = <T, E, M extends EntityId<E>>(v: Entity<T, E, M>): v is Entity<T, E, M> => {
  return v instanceof Entity
}

export abstract class Entity<T, E, H extends EntityId<E>> {
  protected readonly _id: H;
  protected props: T;
  protected _snapshot: string;


  snapshot(): T {
// важливо: snapshot має бути стабільним (createSnapshot)
    const snapObj = createSnapshot(this.props);
    this._snapshot = JSON.stringify(snapObj);

    const copy = JSON.parse(this._snapshot) as T;
    Object.freeze(copy);
    return copy;
  }


  /**
   * Повертає diff у вигляді масиву обʼєктів (DiffViewModel),
   * АЛЕ лише якщо Entity перевизначив toDiff().
   *
   * За замовчуванням toDiff() = null → snapshotDiff() = null.
   */
  snapshotDiff(): DiffViewModel[] | null {
    if (!this._snapshot) return null;

    const diffOptions = this.toDiff();
    if (!diffOptions) return null;

    const beforeObj = JSON.parse(this._snapshot) as unknown;
    const afterObj = createSnapshot(this.props);

    const diffs = diffObjects(beforeObj, afterObj);
    if (diffs.length === 0) return [];

    return buildDiffViewModel(diffs, diffOptions);
  }

  isDirty(): boolean {
    if (!this._snapshot) {
      return false;
    }
    return this._snapshot !== JSON.stringify(createSnapshot(this.props));
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

  toDiff(): DiffFormatterOptions | null {
    return null;
  }
}
