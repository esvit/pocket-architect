import {Jsonizer, Reviver} from "@badcafe/jsonizer";
import Attribute from './Attribute'

export default
@Reviver<Entity>({
  '.': Jsonizer.Self.assign(Entity),
  attributes: {
    '*': Attribute
  },
})
class Entity {
  name: string;
  type: string;
  attributes: Attribute[] = [];
}
