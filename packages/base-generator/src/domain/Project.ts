import { Metadata } from './Metadata';
import { ILayer, Layer } from './Layer';
import { plainListToTree } from '../helpers/tree';
import {AbstractProject, IProject} from './interfaces/IProject';

export { IProject };

export
class Project extends AbstractProject {
  public static create(props: IProject): Project {
    const project = new Project(props);
    project._metadata = Metadata.create(props.metadata);
    project._layers = plainListToTree<ILayer>(props.layers, 'layers')
      .map((i) => Layer.create(i, project));
    return project;
  }
}
