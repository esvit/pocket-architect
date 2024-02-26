import sortBy from 'lodash/sortBy';
import {ISchemaObject, SchemaObject, SchemaObjectId, SchemaObjectType} from './SchemaObject';
import {plainListToTree} from '../helpers/tree';
import {Relation, IRelation, RelationId} from "./Relation";
import {Entity, EntityId} from "@pocket-architect/core";
import {NamingPolicy, NamingPolicyType} from "../policies/NamingPolicy";
import {CamelCaseNamingPolicy} from "../policies/CamelCaseNamingPolicy";
import {PascalCaseNamingPolicy} from "../policies/PascalCaseNamingPolicy";
import {UpperCaseNamingPolicy} from "../policies/UpperCaseNamingPolicy";
import {SnakeCaseNamingPolicy} from "../policies/SnakeCaseNamingPolicy";
import {KebabCaseNamingPolicy} from "../policies/KebabCaseNamingPolicy";

export interface ISchema {
  namingStrategy?: {
    properties?: string;
    database?: string;
    objects?: string;
  };
  relations?: IRelation[];
  objects: ISchemaObject[];
}

export class SchemaId extends EntityId {
  readonly isSchema = true;
}

export
class Schema extends Entity<ISchema, SchemaId> {
  protected _objects: SchemaObject[] = [];
  protected _plainListSchemaObjects: SchemaObject[] = [];
  protected _relations: Relation[] = [];
  protected _namingPolicy: NamingPolicy;
  protected _databaseNamingPolicy: NamingPolicy;
  protected _propertiesNamingPolicy: NamingPolicy;

  get namingPolicy(): NamingPolicy {
    return this._namingPolicy;
  }

  get databaseNamingPolicy(): NamingPolicy {
    return this._databaseNamingPolicy;
  }

  get propertiesNamingPolicy(): NamingPolicy {
    return this._propertiesNamingPolicy;
  }

  static detectNamingPolicy(str: string): NamingPolicyType {
    for (const policy of Object.values(NamingPolicyType)) {
      if (Schema.getNamingPolicy(policy).validate(str)) {
        return policy;
      }
    }
    throw new Error('Invalid naming policy');
  }

  static getNamingPolicy(type: NamingPolicyType): NamingPolicy {
    switch (type) {
      case NamingPolicyType.CamelCase:
        return new CamelCaseNamingPolicy();
      case NamingPolicyType.PascalCase:
        return new PascalCaseNamingPolicy();
      case NamingPolicyType.UpperCase:
        return new UpperCaseNamingPolicy();
      case NamingPolicyType.SnakeCase:
        return new SnakeCaseNamingPolicy();
      case NamingPolicyType.KebabCase:
        return new KebabCaseNamingPolicy();
      default:
        throw new Error('Invalid naming policy');
    }
  }

  public static create(props: ISchema): Schema {
    const schema = new Schema(props);
    schema.rebuildTree();
    schema._relations = props.relations ? props.relations.map((i) => {
      const source = schema.getObjectById(new SchemaObjectId(i.source.id));
      const target = schema.getObjectById(new SchemaObjectId(i.target.id));
      return Relation.create(i, schema, source, target);
    }) : [];
    schema._namingPolicy = Schema.getNamingPolicy(<NamingPolicyType>props.namingStrategy?.objects || NamingPolicyType.PascalCase);
    schema._databaseNamingPolicy = Schema.getNamingPolicy(<NamingPolicyType>props.namingStrategy?.database || NamingPolicyType.SnakeCase);
    schema._propertiesNamingPolicy = Schema.getNamingPolicy(<NamingPolicyType>props.namingStrategy?.properties || NamingPolicyType.CamelCase);
    return schema;
  }

  get objects(): SchemaObject[] {
    return this._objects;
  }

  changeParent(layer: SchemaObject, parent: SchemaObject|null): void {
    layer.parent = parent;
    this.rebuildTree();
  }

  changeOrder(layer: SchemaObject, sortIndex: number): void {
    layer.sortIndex = sortIndex;
    for (const layerIndex in this._plainListSchemaObjects) {
      if (this._plainListSchemaObjects[layerIndex].sortIndex >= sortIndex && this._plainListSchemaObjects[layerIndex].id !== layer.id) {
        this._plainListSchemaObjects[layerIndex].sortIndex += 1;
      }
    }
    this.props.objects = sortBy(this.props.objects, 'sortIndex');
    this.rebuildTree();
  }

  addObject(object: ISchemaObject): SchemaObject {
    if (!object.parentId && object.type !== SchemaObjectType.Domain) {
      throw new Error('Only domain layer can be added without parent');
    }
    if (!this._namingPolicy.validate(object.name)) {
      throw new Error(`"${object.name}" is not valid according to ${this._namingPolicy.type} naming policy`);
    }
    if (object.tableName && !this._databaseNamingPolicy.validate(object.tableName)) {
      throw new Error(`"${object.tableName}" is not valid according to ${this._databaseNamingPolicy.type} naming policy`);
    }
    this.props.objects.push(object);
    this.rebuildTree();
    return this.getObjectById(new SchemaObjectId(object.id));
  }

  removeObjectById(id: SchemaObjectId): void {
    this.props.objects = this.props.objects.filter((i) => i.id !== id.toPrimitive());
    this.rebuildTree();
  }

  protected rebuildTree(): void {
    const [list, tree] = plainListToTree<ISchemaObject, SchemaObject>(this.props.objects, (i) => SchemaObject.create(i, this), 'objects');
    for (const layerIndex in list) {
      list[layerIndex].sortIndex = Number(layerIndex);
    }
    this._plainListSchemaObjects = list;
    this._objects = tree;
  }

  getObjectById(id: SchemaObjectId): SchemaObject|null {
    return this._plainListSchemaObjects.find((i) => i.id.equals(id));
  }

  findObjectsByName(name: string): SchemaObject[] {
    return this._plainListSchemaObjects.filter((i) => i.name === name);
  }

  get listSchemaObjects(): SchemaObject[] {
    return this._plainListSchemaObjects;
  }

  toJSON(): ISchema {
    return {
      objects: this._plainListSchemaObjects.map((i) => i.toJSON()),
      relations: this._relations.map((i) => i.toJSON()),
      namingStrategy: {
        objects: this._namingPolicy.type,
        database: this._databaseNamingPolicy.type,
        properties: this._propertiesNamingPolicy.type
      }
    };
  }

  // relations
  get relations(): Relation[] {
    return this._relations;
  }

  getRelationById(id: RelationId): Relation|null {
    return this._relations.find((i) => i.id.equals(id));
  }

  addRelation(attr: Relation): Relation {
    if (!this._propertiesNamingPolicy.validate(attr.name)) {
      throw new Error(`"${attr.name}" is not valid according to ${this._namingPolicy.type} naming policy`);
    }
    if (!this._databaseNamingPolicy.validate(attr.sourceSchema.columnName)) {
      throw new Error(`"${attr.sourceSchema.columnName}" is not valid according to ${this._databaseNamingPolicy.type} naming policy`);
    }
    if (!this._databaseNamingPolicy.validate(attr.targetSchema.columnName)) {
      throw new Error(`"${attr.targetSchema.columnName}" is not valid according to ${this._databaseNamingPolicy.type} naming policy`);
    }
    this._relations.push(attr);
    return attr;
  }

  removeRelationById(id: RelationId): void {
    const relation = this.getRelationById(id);
    if (!relation) {
      throw new Error('Relation not found');
    }
    this._relations = this._relations.filter((i) => !i.id.equals(id));
  }
}
