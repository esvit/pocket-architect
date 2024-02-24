import {IMetadata, Metadata} from './Metadata';
import {Schema, ISchema} from './Schema';
import {AggregateRoot, EntityId} from "@pocket-architect/core";

export interface IProject {
  metadata: IMetadata;
  schema: ISchema;
}

export class ProjectId extends EntityId {
  readonly isProject = true;
}

export
class Project extends AggregateRoot<IProject, ProjectId> {
  protected _metadata: Metadata = null;
  protected _schema: Schema = null;

  public static create(props: IProject): Project {
    const project = new Project(props);
    project._metadata = Metadata.create(props.metadata);
    project._schema = Schema.create(props.schema);
    return project;
  }

  get metadata(): Metadata {
    return this._metadata;
  }

  get schema(): Schema {
    return this._schema;
  }

  toJSON(): IProject {
    return {
      metadata: this._metadata.toJSON(),
      schema: this._schema.toJSON()
    };
  }
}
