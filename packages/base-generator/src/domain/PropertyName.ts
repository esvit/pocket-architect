import {NamingPolicy} from '../policies/NamingPolicy';

export
class PropertyName {
  protected _name: string;

  constructor(name: string) {
    this._name = name.replace(/([a-z])([A-Z])/g, '$1 $2')
      .replace(/[_-]/g, ' ')
      .toLowerCase();

    if (this._name.match(/^[0-9]/)) {
      throw new Error('Invalid name');
    }
    if (this._name.match(/[^a-z0-9 ]/g)) {
      throw new Error('Invalid name');
    }
  }

  toString(namingPolicy: NamingPolicy): string {
    return namingPolicy.transform(this._name);
  }
}
