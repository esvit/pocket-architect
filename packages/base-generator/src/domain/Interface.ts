import pluralize from 'pluralize';
import {Attribute} from './Attribute';
import {Layer, LayerType, ILayer, LayerId} from './Layer';
import {AbstractProject} from "./interfaces/IProject";
import {capitalize} from "../helpers/string";

export interface IInterface extends ILayer {
  // eslint-disable-next-line  @typescript-eslint/no-explicit-any
  attributes?: any[];
}

export class Interface extends Layer {
  protected _attributes: Attribute[] = [];

  public static create(props: IInterface, project:AbstractProject, parentPart: Layer|null): Interface {
    const inter = new Interface(props, new LayerId(props.id));
    inter._attributes = (props.attributes || []).map((i) => Attribute.create(i, inter));
    inter._project = project;
    inter._parent = parentPart;
    return inter;
  }

  public static createFromPart(part: Interface): Interface {
    const inter = Interface.create({
      ...part.props,
      type: LayerType.Interface,
      name: `I${part.name}`
    }, part.project, part.parent);
    inter._domain = part.domain;
    inter._boundedContext = part.boundedContext;
    part.addDependency(inter, [inter.name]);
    return inter;
  }

  get type(): LayerType {
    return LayerType.Interface;
  }

  get attributes(): Attribute[] {
    return this._attributes;
  }

  get pluralName(): string {
    return pluralize(this.props.name);
  }

  get layers(): Layer[] {
    // if (process.env.JEST_WORKER_ID !== undefined) {
    //   return [];
    // }
    throw new Error(`${capitalize(this.props.type)} ${this.name} does not have layers`);
  }
}
