import { Entity } from '@pocket-architect/core';

export enum AttributeType {
  String = 'string',
  Number = 'number',
  Boolean = 'boolean',
  Date = 'date',
  Enum = 'enum'
}

export interface IMethod {
  name: string;
  type: AttributeType;
  enum?: string[];
  mandatory?: boolean;
  description?: string;
}

export
class Method extends Entity<IMethod> {
  static create(props: IMethod): Method {
    return new Method(props);
  }

  get name(): string {
    return this.props.name;
  }

  get type(): string {
    return this.props.type;
  }

  get description(): string {
    return this.props.description;
  }
}
