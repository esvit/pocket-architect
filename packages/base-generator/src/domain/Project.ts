// import util from 'util';
import { Metadata } from './Metadata';
import {ILayer, Layer, LayerId} from './Layer';
import { plainListToTree } from '../helpers/tree';
import {AbstractProject, ProjectId, IProject} from './interfaces/IProject';

export { IProject, ProjectId };

export
class Project extends AbstractProject {
  protected _plainListLayers: Layer[] = [];

  public static create(props: IProject): Project {
    const project = new Project(props);
    project._metadata = Metadata.create(props.metadata);
    project.rebuildTree();
    return project;
  }

  changeParent(layer: Layer, parent: Layer|null): void {
    layer.parent = parent;
    this.rebuildTree();
  }

  addLayer(layer: ILayer): Layer {
    this.props.layers.push(layer);
    this.rebuildTree();
    return this.getLayerById(new LayerId(layer.id));
  }

  removeLayer(name: string): void {
    this.props.layers = this.props.layers.filter((i) => i.name !== name);
    this.rebuildTree();
  }

  protected rebuildTree(): void {
    const [list, tree] = plainListToTree<ILayer, Layer>(this.props.layers, (i) => Layer.create(i, this), 'layers');
    this._plainListLayers = list;
    this._layers = tree;
    // console.log(util.inspect(tree[0], {showHidden: false, depth: null, colors: true}))
  }

  getLayerById(id: LayerId): Layer|null {
    return this._plainListLayers.find((i) => i.id.equals(id));
  }

  get listLayers(): Layer[] {
    return this._plainListLayers;
  }

  toJSON(): IProject {
    return {
      metadata: this._metadata.toJSON(),
      layers: this._plainListLayers.map((i) => i.toJSON()),
    };
  }
}
