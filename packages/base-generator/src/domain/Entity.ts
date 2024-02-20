import {Attribute, AttributeType} from './Attribute';
import {Interface} from "./Interface";
import {AbstractProject} from "./interfaces/IProject";
import {Layer, LayerId, LayerType} from './Layer';
import { ValueObject, IValueObject } from './ValueObject';
import {Repository} from "./Repository";
import {Service} from "./Service";
import {IRelation, Relation} from "./Relation";
import {Method, IMethod} from "./Method";

export interface IEntity extends IValueObject {
  relations?: IRelation[];
  methods?: IMethod[];
}

export class Entity extends ValueObject {
  protected _repository: Repository = null;
  protected _service: Service = null;
  protected _relations: Relation[] = [];
  protected _methods: Method[] = [];

  public static create(props: IEntity, project: AbstractProject): Entity {
    const entity = new Entity(props, new LayerId(props.id));
    entity._attributes = (props.attributes || []).map((i) => Attribute.create(i, entity));
    entity._attributes.unshift(Attribute.create({
      name: 'id',
      type: AttributeType.Id,
      mandatory: true,
      description: `Unique identifier for entity ${entity.name}`
    }, entity)); // add id attribute
    entity._project = project;
    entity._interface = Interface.createFromPart(entity);
    entity._repository = Repository.createFromEntity(entity);
    entity._service = Service.createFromEntity(entity, entity._repository);
    entity._relations = (props.relations || []).map((i) => Relation.create(i, project));
    entity._methods = (props.methods || []).map((i) => Method.create(i, entity));
    return entity;
  }

  set domain(domain: Layer) {
    this._domain = domain;
    this._interface.domain = domain;
    this._service.domain = domain;
    this._repository.domain = domain;
  }

  set boundedContext(boundedContext: Layer) {
    this._boundedContext = boundedContext;
    this._interface.boundedContext = boundedContext;
    this._service.boundedContext = boundedContext;
    this._repository.boundedContext = boundedContext;
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

  get relations(): Relation[] {
    return this._relations;
  }

  get methods(): Method[] {
    return this._methods;
  }
}

Layer.registerType(LayerType.Entity, Entity);
