import { AggregateRoot } from '@pocket-architect/core';
import { IMetadata, Metadata } from './Metadata';
import { IApplicationPart, ApplicationPart } from './ApplicationPart';
import { plainListToTree } from '../helpers/tree';

export interface IProject {
  metadata: IMetadata;
  parts: IApplicationPart[];
}

export
class Project extends AggregateRoot<IProject> {
  private _metadata: Metadata = null;
  private _parts: ApplicationPart[] = [];

  public static create(props: IProject): Project {
    const project = new Project(props);
    project._metadata = Metadata.create(props.metadata);
    project._parts = plainListToTree<IApplicationPart>(props.parts, 'parts')
      .map((i) => ApplicationPart.create(i));
    return project;
  }

  get metadata(): Metadata {
    return this._metadata;
  }

  get parts(): ApplicationPart[] {
    return this._parts;
  }
}
