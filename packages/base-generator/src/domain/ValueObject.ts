
import { Attribute } from './Attribute';
import { Interface, IInterface } from "./Interface";
import { AbstractProject } from "./interfaces/IProject";
import { Layer, LayerType } from './Layer';

export interface IValueObject extends IInterface {
}

export class ValueObject extends Interface {
  protected _interface: Interface = null;

  public static create(props: IValueObject, project: AbstractProject): ValueObject {
    const entity = new ValueObject(props);
    entity._attributes = (props.attributes || []).map((i) => Attribute.create(i));
    entity._interface = Interface.createFromPart(entity);
    entity._project = project;
    return entity;
  }

  set domain(domain: Layer) {
    this._domain = domain;
    this._interface.domain = domain;
  }

  set context(context: Layer) {
    this._context = context;
    this._interface.context = context;
  }

  get interface(): Interface {
    return this._interface;
  }

  get type(): LayerType {
    return LayerType.ValueObject;
  }
}

Layer.registerType(LayerType.ValueObject, ValueObject);
