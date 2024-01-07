import {Jsonizer, Reviver} from "@badcafe/jsonizer";
import EntityField from './EntityField'

export default
@Reviver<Entity>({
  '.': Jsonizer.Self.assign(Entity),
  fields: {
    '*': EntityField
  },
})
class Entity {
  id:number;
  name: string;
  pluralName: string;
  tableName: string;
  partId: number;
  databaseId: number;
  fields: EntityField[] = [];
}
