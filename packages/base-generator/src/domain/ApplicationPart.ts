import { Entity } from '@pocket-architect/core';
import { Entity as EntityModel } from './Entity';

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
}

export
class ApplicationPart extends Entity<IApplicationPart> {
  protected _parts: ApplicationPart[] = [];

  public static create(props: IApplicationPart): ApplicationPart {
    let part;
    if (props.type === ApplicationType.Entity) {
      part = new EntityModel(props);
    } else {
      part = new ApplicationPart(props);
    }
    part._parts = (props.parts || []).map((i) => ApplicationPart.create(i));
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
}
