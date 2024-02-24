
import { Attribute } from './Attribute';
import { Interface, IInterface } from "./Interface";
import { Schema } from "./Schema";
import {SchemaObject, SchemaObjectId, SchemaObjectType} from './SchemaObject';

export interface IValueObject extends IInterface {
}

export class ValueObject extends Interface {
  protected _interface: Interface = null;
  public static create(props: IValueObject, schema: Schema): ValueObject {
    const entity = new ValueObject(props, new SchemaObjectId(props.id));
    entity._attributes = (props.attributes || []).map((i) => Attribute.create(i, entity));
    entity._interface = Interface.createFromPart(entity);
    entity._schema = schema;
    return entity;
  }

  set domain(domain: SchemaObject) {
    this._domain = domain;
    this._interface.domain = domain;
  }

  set boundedContext(boundedContext: SchemaObject) {
    this._boundedContext = boundedContext;
    this._interface.boundedContext = boundedContext;
  }

  get interface(): Interface {
    return this._interface;
  }

  get type(): SchemaObjectType {
    return SchemaObjectType.ValueObject;
  }
}
