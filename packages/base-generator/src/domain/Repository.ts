import { Entity } from './Entity';
import {Layer, LayerType} from "./Layer";
import {Interface} from "./Interface";

export class Repository extends Interface {
  protected _entity: Entity = null;
  protected _interface: Interface = null;

  public static createFromEntity(entity: Entity): Repository {
    const repo = new Repository({
      id: `repository-${entity.id}`,
      name: `${entity.name}Repo`,
      type: LayerType.Repository
    });
    repo._entity = entity;
    repo._interface = Interface.createFromPart(repo);
    repo._domain = entity.domain;
    repo._boundedContext = entity.boundedContext;
    repo.addDependency(entity, [entity.name]);
    return repo;
  }

  get interface():Interface {
    return this._interface;
  }

  get type(): LayerType {
    return LayerType.Repository;
  }
}

Layer.registerType(LayerType.Repository, Repository);
