import {Jsonizer, Reviver} from "@badcafe/jsonizer";
import { IMetadata, ArchitectureType, TenancyType } from '../domain/Metadata';

export default
@Reviver<Metadata>({
  '.': Jsonizer.Self.assign(Metadata)
})
class Metadata implements IMetadata {
  readonly name:string;
  readonly description?:string;
  readonly initialVersion:string;
  readonly version:string;
  readonly architectureType: ArchitectureType;
  readonly tenancyType: TenancyType;
}
