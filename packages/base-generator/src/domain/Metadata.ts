import { Entity } from '@pocket-architect/core';

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

export
class Metadata extends Entity<IMetadata> {
  static create(props: IMetadata): Metadata {
    return new Metadata(props);
  }

  get name(): string {
    return this.props.name;
  }

  get architectureType(): ArchitectureType {
    return this.props.architectureType;
  }
}
