import {Jsonizer, Reviver} from "@badcafe/jsonizer";
import {LayerType, ILayer} from '../domain/Layer';

export default
@Reviver<Layer>({
  '.': Jsonizer.Self.assign(Layer),
})
class Layer implements ILayer {
  parent:string;
  name: string;
  description?:string;
  type: LayerType;
  // eslint-disable-next-line  @typescript-eslint/no-explicit-any
  fields?: any[];
}
