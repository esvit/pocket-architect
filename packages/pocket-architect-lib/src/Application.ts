import {Jsonizer, Reviver} from "@badcafe/jsonizer";

export enum ArchitectureType {
  Monolithic = 'monolithic',
  Soa = 'soa',
  Microservices = 'microservices'
}

export enum TenancyType {
  Single = 'single',
  Multi = 'multi'
}

export default
@Reviver<Application>({
  '.': Jsonizer.Self.assign(Application)
})
class Application {
  readonly name:string;
  readonly description?:string;
  readonly initialVersion:string;
  readonly version:string;
  readonly architectureType: ArchitectureType;
  readonly tenancyType: TenancyType;
}
