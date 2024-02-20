import { Entity, EntityId } from '@pocket-architect/core';
import { capitalize } from "../helpers/string";
import { Layer } from "./Layer";

export enum AttributeType {
  Id = 'id',
  String = 'string',
  Number = 'number',
  Boolean = 'boolean',
  Date = 'date',
  Enum = 'enum'
}

export interface IAttribute {
  name: string;
  type: AttributeType;
  enum?: string[];
  mandatory?: boolean;
  description?: string;
}

class AttributeId extends EntityId {}

export
class Attribute extends Entity<IAttribute, AttributeId> {
  protected _layer: Layer = null;

  static create(props: IAttribute, layer: Layer): Attribute {
    const attr = new Attribute(props);
    attr._layer = layer;
    return attr;
  }

  get name(): string {
    return this.props.name;
  }

  get type(): string {
    return this.props.type;
  }

  get mandatory(): boolean {
    return this.props.mandatory || false;
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

  get layer(): Layer {
    return this._layer;
  }
}
