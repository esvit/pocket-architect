import { Entity } from './Entity';
import {Layer, LayerType} from "./Layer";
import {Interface} from "./Interface";
import {Repository} from "./Repository";

export class Service extends Interface {
  protected _entity: Entity = null;
  protected _repository: Repository = null;

  public static createFromEntity(entity: Entity, repository: Repository): Service {
    const repo = new Service({
      id: `service-${entity.id}`,
      name: `${entity.name}Service`,
      type: LayerType.Service
    });
    repo._entity = entity;
    repo._repository = repository;
    repo._domain = entity.domain;
    repo._boundedContext = entity.boundedContext;
    repo.addDependency(entity, [entity.name]);
    repo.addDependency(repository, [repository.interface.name]);
    return repo;
  }

  get type(): LayerType {
    return LayerType.Service;
  }
}

Layer.registerType(LayerType.Service, Service);
