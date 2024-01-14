import {Jsonizer, Reviver} from "@badcafe/jsonizer";

export default
@Reviver<Attribute>({
  '.': Jsonizer.Self.assign(Attribute)
})
class Attribute {
  name: string;
  type: string;
}
