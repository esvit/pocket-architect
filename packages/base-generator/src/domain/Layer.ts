import { Entity } from '@pocket-architect/core';
import { AbstractProject } from './interfaces/IProject';
import { kebabCase } from "../helpers/string";

export enum LayerType {
  Domain = 'domain',
  Context = 'context',
  Entity = 'entity',
  ValueObject = 'valueObject',
  Service = 'service',
  Repository = 'repository',
  Aggregate = 'aggregate',
  Interface = 'interface',
}

export interface ILayer {
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

export
class Layer extends Entity<ILayer> {
  protected _domain: Layer = null;
  protected _context: Layer = null;
  protected _parent: Layer = null;
  protected _project: AbstractProject = null;
  protected _layers: Layer[] = [];
  protected _dependencies: ILayerDependency[] = [];
  protected static types: Record<LayerType, typeof Layer> = <Record<LayerType, typeof Layer>>{};

  public static registerType(type: LayerType, model: typeof Layer) {
    Layer.types[type] = model;
  }

  public static create(props: ILayer, project:AbstractProject, parentPart: Layer|null = null, parentDomain: Layer|null = null, parentModule: Layer|null = null): Layer {
    let part;
    let domain = parentDomain;
    let context = parentModule;
    if (parentPart) {
      if (parentPart.type === LayerType.Domain) {
        domain = parentPart;
      } else {
        domain = parentPart.domain;
      }
      if (parentPart.type === LayerType.Context) {
        context = parentPart;
      } else {
        context = parentPart.context;
      }
    }
    if (Layer.types[props.type]) {
      part = Layer.types[props.type].create(props, project, parentPart, domain, context);
    } else {
      part = new Layer(props);
    }
    if (props.type === LayerType.Domain) {
      domain = part;
    }
    if (props.type === LayerType.Context) {
      context = part;
    }
    part.domain = domain;
    part.context = context;
    part._project = project;
    part._parent = parentPart;
    part._layers = (props.layers || []).map((i) => Layer.create(i, project, part, domain, context));
    return part;
  }

  get project():AbstractProject {
    return this._project;
  }

  set domain(domain: Layer) {
    this._domain = domain;
  }

  set context(module: Layer) {
    this._context = module;
  }

  get parent():Layer {
    return this._parent;
  }

  get domain():Layer|null {
    return this._domain;
  }

  get context():Layer {
    return this._context;
  }

  get path(): Layer[] {
    return [this.domain, this.context, this].filter(p => !!p);
  }

  get name(): string {
    return this.props.name;
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
}
