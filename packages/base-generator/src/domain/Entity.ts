import {Attribute, AttributeType} from './Attribute';
import {Interface} from "./Interface";
import {Schema} from "./Schema";
import {SchemaObject, SchemaObjectId, SchemaObjectType} from './SchemaObject';
import { ValueObject, IValueObject } from './ValueObject';
import {Repository} from "./Repository";
import {Service} from "./Service";
import {Method, IMethod} from "./Method";

export interface IEntity extends IValueObject {
  methods?: IMethod[];
}

export class Entity extends ValueObject {
  protected _repository: Repository = null;
  protected _service: Service = null;
  protected _methods: Method[] = [];

  public static create(props: IEntity, schema: Schema): Entity {
    const entity = new Entity(props, new SchemaObjectId(props.id));
    entity._attributes = (props.attributes || []).map((i) => Attribute.create(i, entity));
    if (!entity.attributes.length) {
      entity._attributes.push(Attribute.create({
        name: 'id',
        type: AttributeType.Id,
        system: true,
        mandatory: true,
        description: `Unique identifier for entity ${entity.name}`
      }, entity)); // add id attribute
    }
    entity._schema = schema;
    entity._interface = Interface.createFromPart(entity);
    entity._repository = Repository.createFromEntity(entity);
    entity._service = Service.createFromEntity(entity, entity._repository);
    entity._methods = (props.methods || []).map((i) => Method.create(i, entity));
    return entity;
  }

  set domain(domain: SchemaObject) {
    this._domain = domain;
    this._interface.domain = domain;
    this._service.domain = domain;
    this._repository.domain = domain;
  }

  set boundedContext(boundedContext: SchemaObject) {
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

  get type(): SchemaObjectType {
    return SchemaObjectType.Entity;
  }

  get methods(): Method[] {
    return this._methods;
  }

  toJSON(): IEntity {
    const obj:IEntity = super.toJSON() as IEntity;
    return obj;
  }
}
