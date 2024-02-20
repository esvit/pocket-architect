
import { Attribute } from './Attribute';
import { Interface, IInterface } from "./Interface";
import { AbstractProject } from "./interfaces/IProject";
import {Layer, LayerId, LayerType} from './Layer';

export interface IValueObject extends IInterface {
}

export class ValueObject extends Interface {
  protected _interface: Interface = null;
  public static create(props: IValueObject, project: AbstractProject): ValueObject {
    const entity = new ValueObject(props, new LayerId(props.id));
    entity._attributes = (props.attributes || []).map((i) => Attribute.create(i, entity));
    entity._interface = Interface.createFromPart(entity);
    entity._project = project;
    return entity;
  }

  set domain(domain: Layer) {
    this._domain = domain;
    this._interface.domain = domain;
  }

  set boundedContext(boundedContext: Layer) {
    this._boundedContext = boundedContext;
    this._interface.boundedContext = boundedContext;
  }

  get interface(): Interface {
    return this._interface;
  }

  get type(): LayerType {
    return LayerType.ValueObject;
  }
}

Layer.registerType(LayerType.ValueObject, ValueObject);
