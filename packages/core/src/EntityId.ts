import createUUID from 'uuid-by-string'
import { createId } from '@paralleldrive/cuid2'

export class EntityId {
  protected _recordId: string = null;
  protected _uuid: string = null;

  constructor(recordId: string|number = null, uuid: string = null) {
    this._recordId = recordId ? recordId.toString() : createId();
    if (!uuid) {
      this._uuid = createUUID(recordId ? recordId.toString() : createId(), createUUID(this.constructor.name));
    }
  }

  toPrimitive(): string {
    return this._recordId;
  }

  toString(): string {
    return this._uuid;
  }

  equals(id: EntityId): boolean {
    return this._uuid === id._uuid;
  }
}
