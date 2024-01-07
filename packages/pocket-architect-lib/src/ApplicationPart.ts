import {Jsonizer, Reviver} from "@badcafe/jsonizer";

export default
@Reviver<ApplicationPart>({
  '.': Jsonizer.Self.assign(ApplicationPart),
})
class ApplicationPart {
  id:number;
  parentId:number;
  name: string;
  description?:string;
  partType: string;
}
