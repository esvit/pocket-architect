import {Project, IProject} from './domain/Project';
import {Metadata, IMetadata, TenancyType, ArchitectureType} from './domain/Metadata';
import {SchemaObject, ISchemaObject, SchemaObjectType, SchemaObjectId} from './domain/SchemaObject';
import {Entity, IEntity} from './domain/Entity';
import PocketArchitect from './PocketArchitect';
import BaseTemplateGenerator, { TemplateGeneratorOptions, ContentFile, getCommander } from './BaseTemplateGenerator';
import {Service} from "./domain/Service";
import {Repository} from "./domain/Repository";
import {ValueObject} from "./domain/ValueObject";
import {Interface} from "./domain/Interface";
import {Schema, ISchema, SchemaId} from "./domain/Schema";
import {Attribute, IAttribute, AttributeId} from "./domain/Attribute";
import {Relation, IRelation, IRelationEntity, RelationId} from "./domain/Relation";

SchemaObject.registerType(SchemaObjectType.Entity, Entity);
SchemaObject.registerType(SchemaObjectType.ValueObject, ValueObject);
SchemaObject.registerType(SchemaObjectType.Service, Service);
SchemaObject.registerType(SchemaObjectType.Repository, Repository);

export default PocketArchitect;
export {
  Project, IProject,
  Metadata, IMetadata, TenancyType, ArchitectureType,
  Schema, ISchema, SchemaId,
  SchemaObject, ISchemaObject, SchemaObjectType, SchemaObjectId,
  Entity, IEntity,
  Interface,
  Attribute, IAttribute, AttributeId,
  Relation, IRelation, IRelationEntity, RelationId,
  BaseTemplateGenerator, TemplateGeneratorOptions, ContentFile, getCommander
};
