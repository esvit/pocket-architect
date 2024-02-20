import { Entity, EntityId } from '@pocket-architect/core';
import {AbstractProject} from './interfaces/IProject';

export enum RelationType {
  OneToOne = '1:1',
  ManyToOne = 'n:1',
  OneToMany = '1:n',
  ManyToMany = 'n:n'
}

export interface IRelation {
  name: string;
  entity: string;
  type: RelationType;
  ref?: string;
  description?: string;
}

class RelationId extends EntityId {}

export
class Relation extends Entity<IRelation, RelationId> {
  protected _project: AbstractProject;

  static create(props: IRelation, project: AbstractProject): Relation {
    const relation = new Relation(props);
    relation._project = project;
    return relation;
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

  toJSON(): IRelation {
    return this.props;
  }
}
