import { Attribute } from './Attribute';
import {Interface} from "./Interface";
import {AbstractProject} from "./interfaces/IProject";
import { Layer, LayerType} from './Layer';
import { ValueObject, IValueObject } from './ValueObject';
import {Repository} from "./Repository";
import {Service} from "./Service";

export interface IEntity extends IValueObject {
}

export class Entity extends ValueObject {
  protected _repository: Repository = null;
  protected _service: Service = null;

  public static create(props: IEntity, project: AbstractProject): Entity {
    const entity = new Entity(props);
    entity._attributes = (props.attributes || []).map((i) => Attribute.create(i));
    entity._project = project;
    entity._interface = Interface.createFromPart(entity);
    entity._repository = Repository.createFromEntity(entity);
    entity._service = Service.createFromEntity(entity, entity._repository);
    return entity;
  }

  set domain(domain: Layer) {
    this._domain = domain;
    this._interface.domain = domain;
    this._service.domain = domain;
    this._repository.domain = domain;
  }

  set context(context: Layer) {
    this._context = context;
    this._interface.context = context;
    this._service.context = context;
    this._repository.context = context;
  }

  get repository(): Repository {
    return this._repository;
  }

  get service(): Service {
    return this._service;
  }

  get type(): LayerType {
    return LayerType.Entity;
  }
}

Layer.registerType(LayerType.Entity, Entity);
