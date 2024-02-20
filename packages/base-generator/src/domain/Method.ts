import {Entity, EntityId} from '@pocket-architect/core';
import { Layer } from './Layer';

export enum AttributeType {
  String = 'string',
  Number = 'number',
  Boolean = 'boolean',
  Date = 'date',
  Enum = 'enum'
}

export interface IMethod {
  name: string;
  type: AttributeType;
  enum?: string[];
  mandatory?: boolean;
  description?: string;
}

class MethodId extends EntityId {}

export
class Method extends Entity<IMethod, MethodId> {
  protected _entity: Layer = null;

  static create(props: IMethod, entity: Layer): Method {
    const method = new Method(props);
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

  get entity(): Layer {
    return this._entity;
  }
}
