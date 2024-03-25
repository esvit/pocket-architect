import createUUID from 'uuid-by-string'
import { createId } from '@paralleldrive/cuid2'

export class EntityId<T> {
  protected _recordId: T|null = null;
  protected _uuid: string = null;
  protected _hasValue: boolean = false;

  constructor(recordId: T = null, uuid: string = null) {
    this._recordId = recordId ? recordId : null;
    if (!uuid) {
      this._uuid = createUUID(recordId ? recordId.toString() : createId(), createUUID(this.constructor.name));
    }
  }

  toPrimitive(): T {
    return this._hasValue ? this._recordId : null;
  }

  toString(): string {
    return this._uuid;
  }

  equals(id: EntityId<T>): boolean {
    return this._uuid === id._uuid;
  }
}
