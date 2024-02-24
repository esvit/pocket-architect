import { Entity, EntityId } from '@pocket-architect/core';
import { capitalize } from "../helpers/string";
import { SchemaObject } from "./SchemaObject";

export enum AttributeType {
  Id = 'id',
  String = 'string',
  Number = 'number',
  Boolean = 'boolean',
  Date = 'date',
  Enum = 'enum'
}

export interface IAttribute {
  id?: string;
  name: string;
  type: AttributeType;
  enum?: string[];
  system?: boolean;
  transient?: boolean;
  readonly?: boolean;
  mandatory?: boolean;
  description?: string;
  columnName?: string;
}

export class AttributeId extends EntityId {
  readonly isAttribute = true;
}

export
class Attribute extends Entity<IAttribute, AttributeId> {
  protected _layer: SchemaObject = null;

  static create(props: IAttribute, layer: SchemaObject): Attribute {
    const attr = new Attribute(props, new AttributeId(props.id));
    attr._layer = layer;
    return attr;
  }

  get name(): string {
    return this.props.name;
  }

  private set name(val:string) {
    if (!val.match(/^[a-zA-Z_][a-zA-Z0-9_]*$/)) {
      throw new Error(`Invalid attribute name: ${val}`);
    }
    this.props.name = val;
  }

  get columnName(): string {
    return this.props.columnName;
  }

  private set columnName(val:string) {
    if (!val.match(/^[a-zA-Z_][a-zA-Z0-9_]*$/)) {
      throw new Error(`Invalid column name: ${val}`);
    }
    this.props.columnName = val;
  }

  get type(): string {
    return this.props.type;
  }

  get mandatory(): boolean {
    return this.props.mandatory || false;
  }

  get system(): boolean {
    return this.props.system || false;
  }

  get description(): string {
    return this.props.description;
  }

  get enum(): string[] {
    return this.props.enum;
  }

  get jsType(): string {
    switch (this.props.type) {
      case AttributeType.Id: return `${capitalize(this.layer.name)}Id`;
      case AttributeType.String: return 'string';
      case AttributeType.Number: return 'number';
      case AttributeType.Boolean: return 'boolean';
      case AttributeType.Date: return 'Date';
      case AttributeType.Enum: return this.enumName;
    }
    return 'any';
  }

  get enumName():string {
    return `${capitalize(this.name)}Enum`;
  }

  get layer(): SchemaObject {
    return this._layer;
  }

  updateProps(props: IAttribute): void {
    this.name = props.name;
    this.props.transient = props.transient;
    this.props.readonly = props.readonly;
    this.props.mandatory = props.mandatory;
    this.props.type = props.type;
    this.props.description = props.description;
    this.columnName = props.columnName;
    if (this.props.type === AttributeType.Enum) {
      this.props.enum = props.enum;
    } else {
      delete this.props.enum;
    }
  }

  toJSON(): IAttribute {
    return {
      id: this.id.toPrimitive(),
      ...super.toJSON()
    };
  }
}
