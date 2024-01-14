import { Entity } from 'pocket-architect-core';
import {Attribute} from './Attribute';

export enum ApplicationType {
  Service = 'service',
  Module = 'module',
  Entity = 'entity',
  ValueObject = 'valueObject'
}

export interface IApplicationPart {
  parent?: string;
  name: string;
  description?:string;
  type: ApplicationType;

  parts?: IApplicationPart[];
  // eslint-disable-next-line  @typescript-eslint/no-explicit-any
  attributes?: any[];
}

export
class ApplicationPart extends Entity<IApplicationPart> {
  private _parts: ApplicationPart[] = [];
  private _attributes: Attribute[] = [];

  public static create(props: IApplicationPart): ApplicationPart {
    const part = new ApplicationPart(props);
    part._parts = (props.parts || []).map((i) => ApplicationPart.create(i));
    part._attributes = (props.attributes || []).map((i) => Attribute.create(i));
    return part;
  }

  get name(): string {
    return this.props.name;
  }

  get type(): ApplicationType {
    return this.props.type;
  }

  get parts(): ApplicationPart[] {
    return this._parts;
  }

  get attributes(): Attribute[] {
    return this._attributes;
  }
}
