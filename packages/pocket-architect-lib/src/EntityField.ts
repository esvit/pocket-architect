import {Jsonizer, Reviver} from "@badcafe/jsonizer";

export default
@Reviver<EntityField>({
  '.': Jsonizer.Self.assign(EntityField)
})
class EntityField {
  id:number;
  name: string;
  pluralName: string;
  tableName: string;
  partId: number;
  databaseId: number;
}
