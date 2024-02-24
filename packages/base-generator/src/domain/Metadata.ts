import {Entity, EntityId} from '@pocket-architect/core';

export enum ArchitectureType {
  Monolithic = 'monolithic',
  Multiservices = 'multiservices'
}

export enum TenancyType {
  SingleTenant = 'singletenant',
  MultiTenants = 'multitenants'
}

export interface IMetadata {
  name: string;
  description?: string;
  initialVersion: string;
  version: string;
  architectureType: ArchitectureType;
  tenancyType: TenancyType;
}

export class MetadataId extends EntityId {
  readonly isMetadata = true;
}
export
class Metadata extends Entity<IMetadata, MetadataId> {
  static create(props: IMetadata): Metadata {
    return new Metadata(props);
  }

  get name(): string {
    return this.props.name;
  }

  get architectureType(): ArchitectureType {
    return this.props.architectureType;
  }

  toJSON(): IMetadata {
    return this.props;
  }
}
