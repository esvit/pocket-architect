import {Entity, EntityId} from '@pocket-architect/core';
import { SchemaObject } from './SchemaObject';

export enum AttributeType {
  String = 'string',
  Number = 'number',
  Boolean = 'boolean',
  Date = 'date',
  Enum = 'enum'
}

export interface IMethod {
  id: string;
  name: string;
  type: AttributeType;
  enum?: string[];
  mandatory?: boolean;
  description?: string;
}

export class MethodId extends EntityId {
  readonly isMethod = true;
}

export
class Method extends Entity<IMethod, MethodId> {
  protected _entity: SchemaObject = null;

  static create(props: IMethod, entity: SchemaObject): Method {
    const method = new Method(props, props.id);
    method._entity = entity;
    return method;
  }

  get name(): string {
    return this.props.name;
  }

  get type(): string {
    return this.props.type;
  }

  get description(): string {
    return this.props.description;
  }

  get entity(): SchemaObject {
    return this._entity;
  }
}
