import pluralize from 'pluralize';
import {Attribute, AttributeId, IAttribute} from './Attribute';
import {SchemaObject, SchemaObjectType, ISchemaObject, SchemaObjectId} from './SchemaObject';
import {Schema} from "./Schema";
import {capitalize} from "../helpers/string";

export interface IInterface extends ISchemaObject {
  attributes?: IAttribute[];
}

export class Interface extends SchemaObject {
  protected _attributes: Attribute[] = [];

  public static create(props: IInterface, schema:Schema, parentPart: SchemaObject|null): Interface {
    const inter = new Interface(props, new SchemaObjectId(props.id));
    inter._attributes = (props.attributes || []).map((i) => Attribute.create(i, inter));
    inter._schema = schema;
    inter._parent = parentPart;
    return inter;
  }

  public static createFromPart(part: Interface): Interface {
    const inter = Interface.create({
      ...part.props,
      type: SchemaObjectType.Interface,
      name: `I${part.name}`
    }, part.schema, part.parent);
    inter._domain = part.domain;
    inter._boundedContext = part.boundedContext;
    part.addDependency(inter, [inter.name]);
    return inter;
  }

  get type(): SchemaObjectType {
    return SchemaObjectType.Interface;
  }

  get attributes(): Attribute[] {
    return this._attributes;
  }

  get pluralName(): string {
    return pluralize(this.props.name);
  }

  getAttributeById(id: AttributeId): Attribute|null {
    return this._attributes.find((i) => i.id.equals(id));
  }

  addAttribute(attr: Attribute): Attribute {
    if (attr.name && !this._schema.propertiesNamingPolicy.validate(attr.name)) {
      throw new Error(`"${attr.name}" is not valid according to ${this.schema.propertiesNamingPolicy.type} naming policy`);
    }
    if (attr.columnName && !this._schema.databaseNamingPolicy.validate(attr.columnName)) {
      throw new Error(`"${attr.columnName}" is not valid according to ${this.schema.databaseNamingPolicy.type} naming policy`);
    }
    this._attributes.push(attr);
    return attr;
  }

  removeAttributeById(id: AttributeId, ignoreSystem = false): void {
    const attr = this.getAttributeById(id);
    if (!attr) {
      throw new Error('Attribute not found');
    }
    if (!ignoreSystem && attr.system) {
      throw new Error('System attribute can not be removed');
    }
    this._attributes = this._attributes.filter((i) => !i.id.equals(id));
  }

  get objects(): SchemaObject[] {
    // if (process.env.JEST_WORKER_ID !== undefined) {
    //   return [];
    // }
    throw new Error(`${capitalize(this.props.type)} ${this.name} does not have objects`);
  }

  toJSON(): IInterface {
    const obj:IInterface = super.toJSON() as IInterface;
    obj.attributes = this._attributes.map((i) => i.toJSON());
    return obj;
  }
}
