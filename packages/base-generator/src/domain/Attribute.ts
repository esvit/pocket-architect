import { Entity } from '@pocket-architect/core';
import {capitalize} from "../helpers/string";

export enum AttributeType {
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

export
class Attribute extends Entity<IAttribute> {
  static create(props: IAttribute): Attribute {
    return new Attribute(props);
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
      case AttributeType.String: return 'string';
      case AttributeType.Number: return 'number';
      case AttributeType.Boolean: return 'boolean';
      case AttributeType.Date: return 'Date';
      case AttributeType.Enum: return this.enumName;
    }
  }

  get enumName():string {
    return `${capitalize(this.name)}Enum`;
  }
}
