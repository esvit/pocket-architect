import { Entity, EntityId } from '@pocket-architect/core';
import {Schema} from './Schema';
import {SchemaObject, SchemaObjectId} from './SchemaObject';

export enum RelationType {
  OneToOne = '1:1',
  ManyToOne = 'n:1',
  OneToMany = '1:n',
  ManyToMany = 'n:n'
}

export interface IRelationEntity {
  id: string;
  columnName: string;
  nullable?: boolean;
}

export interface IRelation {
  id: string;
  name: string;
  type: RelationType;
  source: IRelationEntity,
  target: IRelationEntity,
  junctionPayload?: { id: string; },
  description?: string;
}

export class RelationId extends EntityId {
  readonly isRelation = true;
}

export
class Relation extends Entity<IRelation, RelationId> {
  protected _schema: Schema;
  protected _source: SchemaObject;
  protected _target: SchemaObject;

  static create(props: IRelation, schema:Schema, source: SchemaObject, target: SchemaObject): Relation {
    const relation = new Relation(props, new RelationId(props.id));
    relation._schema = schema;
    relation._source = source;
    relation._target = target;
    return relation;
  }

  get name(): string {
    return this.props.name;
  }

  private set name(val: string) {
    this.props.name = val;
  }

  get source(): SchemaObject {
    return this._source;
  }

  get sourceSchema(): IRelationEntity {
    return this.props.source;
  }

  get targetSchema(): IRelationEntity {
    return this.props.target;
  }

  get target(): SchemaObject {
    return this._target;
  }

  get type(): string {
    return this.props.type;
  }

  get description(): string {
    return this.props.description;
  }

  updateProps(props: IRelation): void {
    this.name = props.name;
    this.props.type = props.type;
    this.props.description = props.description;

    const source = this._schema.getObjectById(new SchemaObjectId(props.source.id));
    const target = this._schema.getObjectById(new SchemaObjectId(props.target.id));
    const junctionPayload = props.junctionPayload ? this._schema.getObjectById(new SchemaObjectId(props.junctionPayload.id)) : null;
    if (!source) {
      throw new Error('Source object not found');
    }
    if (!target) {
      throw new Error('Target not found');
    }
    if (props.junctionPayload && !junctionPayload) {
      throw new Error('Junction payload object not found');
    }
    this.props.source = {
      id: source.id.toPrimitive(),
      columnName: props.source.columnName,
      nullable: props.source.nullable
    };
    this.props.target = {
      id: target.id.toPrimitive(),
      columnName: props.target.columnName,
      nullable: props.target.nullable
    };
    this.props.junctionPayload = props.junctionPayload ? { id: junctionPayload.id.toPrimitive() } : null;
  }

  toJSON(): IRelation {
    return {
      id: this.id.toPrimitive(),
      ...super.toJSON()
    };
  }
}
