import {Jsonizer, Reviver} from "@badcafe/jsonizer";
import {ApplicationType, IApplicationPart} from '../domain/ApplicationPart';

export default
@Reviver<ApplicationPart>({
  '.': Jsonizer.Self.assign(ApplicationPart),
})
class ApplicationPart implements IApplicationPart {
  parent:string;
  name: string;
  description?:string;
  type: ApplicationType;
  // eslint-disable-next-line  @typescript-eslint/no-explicit-any
  fields?: any[];
}
