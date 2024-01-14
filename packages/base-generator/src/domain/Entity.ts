import pluralize from 'pluralize';
import { Entity as EntityCore } from '@pocket-architect/core';
import { capitalize } from '../helpers/string';
import { Attribute } from './Attribute';

export interface IEntity {
  parent?: string;
  name: string;
  type: string;
  description?:string;

  // eslint-disable-next-line  @typescript-eslint/no-explicit-any
  attributes?: any[];
}

export class Entity extends EntityCore<IEntity> {
  protected _attributes: Attribute[] = [];

  public static create(props: IEntity): Entity {
    const entity = new Entity(props);
    entity._attributes = (props.attributes || []).map((i) => Attribute.create(i));
    return new Entity(props);
  }

  get name(): string {
    return this.props.name;
  }

  get type(): string {
    return this.props.type;
  }

  get parts() {
    return [];
  }

  get pluralName(): string {
    return pluralize(this.props.name);
  }

  get repositoryName(): string {
    return `${capitalize(this.pluralName)}Repo`;
  }

  get attributes(): Attribute[] {
    return this._attributes;
  }
}
