import omit from 'lodash/omit';
import { Entity, EntityId } from '@pocket-architect/core';
import { AbstractProject } from './interfaces/IProject';
import { kebabCase } from "../helpers/string";

export enum LayerType {
  Domain = 'domain',
  BoundedContext = 'bounded-context',
  Entity = 'entity',
  ValueObject = 'valueObject',
  Service = 'service',
  Repository = 'repository',
  Aggregate = 'aggregate',
  Interface = 'interface',
}

export interface ILayer {
  id: string;
  parent?: string;
  name: string;
  description?:string;
  type: LayerType;

  layers?: ILayer[];
}

export interface ILayerDependency {
  names: string[],
  part: Layer
}

export class LayerId extends EntityId {}

export
class Layer extends Entity<ILayer, LayerId> {
  protected _domain: Layer = null;
  protected _boundedContext: Layer = null;
  protected _parent: Layer = null;
  protected _project: AbstractProject = null;
  protected _layers: Layer[] = [];
  protected _dependencies: ILayerDependency[] = [];
  protected static types: Record<LayerType, typeof Layer> = <Record<LayerType, typeof Layer>>{};

  public static registerType(type: LayerType, model: typeof Layer):void {
    Layer.types[type] = model;
  }

  public static create(props: ILayer, project:AbstractProject, parentPart: Layer|null = null, parentDomain: Layer|null = null, parentModule: Layer|null = null): Layer {
    let part;
    let domain = parentDomain;
    let boundedContext = parentModule;
    if (Layer.types[props.type]) {
      part = Layer.types[props.type].create(props, project, parentPart, domain, boundedContext);
    } else {
      part = new Layer(props, new LayerId(props.id));
    }
    if (props.type === LayerType.Domain) {
      domain = part;
    }
    if (props.type === LayerType.BoundedContext) {
      boundedContext = part;
    }
    part.domain = domain;
    part.boundedContext = boundedContext;
    part._project = project;
    if (parentPart) {
      part.parent = parentPart;
    }
    part._layers = (props.layers || []).map((i) => Layer.create(i, project, part, domain, boundedContext));
    return part;
  }

  get project():AbstractProject {
    return this._project;
  }

  set domain(domain: Layer) {
    this._domain = domain;
  }

  set boundedContext(module: Layer) {
    this._boundedContext = module;
  }

  get parent():Layer {
    return this._parent;
  }

  set parent(val: Layer) {
    if (val && [LayerType.Entity, LayerType.ValueObject, LayerType.Interface].includes(val.type)) {
      throw new Error('Invalid parent type');
    }
    this._parent = val;
    if (val) {
      this.props.parent = val && val.name;
    } else {
      delete this.props.parent;
    }
    if (val) {
      if (val.type === LayerType.Domain) {
        this.domain = val;
      } else {
        this.domain = val.domain;
      }
      if (val.type === LayerType.BoundedContext) {
        this.boundedContext = val;
      } else {
        this.boundedContext = val.boundedContext;
      }
    }
  }

  get domain():Layer|null {
    return this._domain;
  }

  get boundedContext():Layer {
    return this._boundedContext;
  }

  get path(): Layer[] {
    return [this._domain, this._boundedContext, this].filter(p => !!p);
  }
  get name(): string {
    return this.props.name;
  }

  set name(name:string) {
    this.props.name = name;
  }

  get type(): LayerType {
    return this.props.type;
  }

  get layers(): Layer[] {
    return this._layers;
  }

  get dependencies(): ILayerDependency[] {
    return this._dependencies;
  }

  get folderName(): string {
    return kebabCase(this.name);
  }

  addDependency(part: Layer, names: string[]) {
    let dependency = this._dependencies.find((d) => d.part.id === part.id);
    if (!dependency) {
      dependency = { part, names: [] };
      this._dependencies.push(dependency);
    }
    dependency.names = dependency.names.concat(names.filter((name) => dependency.names.indexOf(name) === -1));
  }

  toJSON(): ILayer {
    return omit(this.props, 'layers');
  }
}
