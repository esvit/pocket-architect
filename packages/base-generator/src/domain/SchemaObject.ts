import omit from 'lodash/omit';
import { Entity, EntityId } from '@pocket-architect/core';
import { Schema } from './Schema';
import { kebabCase } from "../helpers/string";

export enum SchemaObjectType {
  Domain = 'domain',
  BoundedContext = 'bounded-context',
  Entity = 'entity',
  ValueObject = 'value-object',
  Service = 'service',
  Repository = 'repository',
  Aggregate = 'aggregate',
  Interface = 'interface',
}

export interface ISchemaObject {
  id: string;
  parentId?: string;
  sortIndex?: number;
  name: string;
  tableName?: string;
  description?:string;
  type: SchemaObjectType;

  objects?: ISchemaObject[];
}

export interface ISchemaObjectDependency {
  names: string[],
  part: SchemaObject
}

export class SchemaObjectId extends EntityId {
  readonly isSchemaObject = true;
}

export
class SchemaObject extends Entity<ISchemaObject, SchemaObjectId> {
  protected _domain: SchemaObject = null;
  protected _boundedContext: SchemaObject = null;
  protected _parent: SchemaObject = null;
  protected _schema: Schema = null;
  protected _objects: SchemaObject[] = [];
  protected _dependencies: ISchemaObjectDependency[] = [];
  protected _sortIndex = 0;
  protected static types: Record<SchemaObjectType, typeof SchemaObject> = <Record<SchemaObjectType, typeof SchemaObject>>{};

  public static registerType(type: SchemaObjectType, model: typeof SchemaObject):void {
    SchemaObject.types[type] = model;
  }

  public static create(props: ISchemaObject, schema:Schema, parentPart: SchemaObject|null = null, parentDomain: SchemaObject|null = null, parentModule: SchemaObject|null = null): SchemaObject {
    let part;
    let domain = parentDomain;
    let boundedContext = parentModule;
    if (SchemaObject.types[props.type]) {
      part = SchemaObject.types[props.type].create(props, schema, parentPart, domain, boundedContext);
    } else {
      part = new SchemaObject(props, new SchemaObjectId(props.id));
    }
    if (props.type === SchemaObjectType.Domain) {
      domain = part;
    }
    if (props.type === SchemaObjectType.BoundedContext) {
      boundedContext = part;
    }
    part.domain = domain;
    part.boundedContext = boundedContext;
    part._schema = schema;
    if (parentPart) {
      part.parent = parentPart;
    }
    part._objects = (props.objects || []).map((i, n) => {
      const layer = SchemaObject.create(i, schema, part, domain, boundedContext);
      layer.sortIndex = n;
      return layer;
    });
    return part;
  }

  get sortIndex():number {
    return this._sortIndex;
  }

  set sortIndex(sortIndex: number) {
    this._sortIndex = sortIndex;
    this.props.sortIndex = this._sortIndex;
  }

  get schema():Schema {
    return this._schema;
  }

  set domain(domain: SchemaObject) {
    this._domain = domain;
  }

  set boundedContext(module: SchemaObject) {
    this._boundedContext = module;
  }

  get parent():SchemaObject {
    return this._parent;
  }

  set parent(val: SchemaObject) {
    if (val && [SchemaObjectType.Entity, SchemaObjectType.ValueObject, SchemaObjectType.Interface].includes(val.type)) {
      throw new Error('Invalid parent type');
    }
    this._parent = val;
    if (val) {
      this.props.parentId = val && val.id.toPrimitive();
    } else {
      delete this.props.parentId;
    }
    if (val) {
      if (val.type === SchemaObjectType.Domain) {
        this.domain = val;
      } else {
        this.domain = val.domain;
      }
      if (val.type === SchemaObjectType.BoundedContext) {
        this.boundedContext = val;
      } else {
        this.boundedContext = val.boundedContext;
      }
    }
  }

  get domain():SchemaObject|null {
    console.info('domain', this,this._domain)
    return this._domain;
  }

  get boundedContext():SchemaObject {
    return this._boundedContext;
  }

  get path(): SchemaObject[] {
    return [this._domain, this._boundedContext, this].filter(p => !!p);
  }
  get name(): string {
    return this.props.name;
  }

  set name(name:string) {
    this.props.name = name;
  }

  get type(): SchemaObjectType {
    return this.props.type;
  }

  get objects(): SchemaObject[] {
    return this._objects;
  }

  get dependencies(): ISchemaObjectDependency[] {
    return this._dependencies;
  }

  get folderName(): string {
    return kebabCase(this.name);
  }

  addDependency(part: SchemaObject, names: string[]) {
    let dependency = this._dependencies.find((d) => d.part.id === part.id);
    if (!dependency) {
      dependency = { part, names: [] };
      this._dependencies.push(dependency);
    }
    dependency.names = dependency.names.concat(names.filter((name) => dependency.names.indexOf(name) === -1));
  }

  toJSON(): ISchemaObject {
    return omit(this.props, 'objects');
  }
}
