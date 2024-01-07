import {Jsonizer, Reviver} from "@badcafe/jsonizer";

export default
@Reviver<Layer>({
  '.': Jsonizer.Self.assign(Layer)
})
class Layer {
  id:number;
  name:string = '';
}
