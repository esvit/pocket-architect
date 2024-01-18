import { AggregateRoot } from '@pocket-architect/core';
import {IMetadata, Metadata} from '../Metadata';
import {Layer, ILayer} from '../Layer';

export interface IProject {
  metadata: IMetadata;
  layers: ILayer[];
}

export class AbstractProject extends AggregateRoot<IProject> {
  protected _metadata: Metadata = null;
  protected _layers: Layer[] = [];

  get metadata(): Metadata {
    return this._metadata;
  }

  get layers(): Layer[] {
    return this._layers;
  }
}
