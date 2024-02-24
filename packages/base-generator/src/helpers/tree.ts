import { SchemaObject } from '../domain/SchemaObject';

export function plainListToTree<T, H extends SchemaObject>(list:T[], applyFn: (arg: T) => H, childrenKey = 'children', idKey = 'id', parentKey = 'parentId'):[H[], H[]] {
  const tree = [];
  const lookup:Record<string, H> = {};
  const returnList:H[] = [];
  for (const obj of list) {
    lookup[obj[idKey]] = applyFn(obj);
    returnList.push(lookup[obj[idKey]]);
  }
  for (const obj of list) {
    const newObj = lookup[obj[idKey]];
    if (obj[parentKey]) {
      if (!lookup[obj[parentKey]]) {
        throw new Error(`Item ${obj[idKey]} has invalid parent id ${obj[parentKey]}`);
      }
      lookup[obj[parentKey]][childrenKey].push(newObj);
      newObj.parent = lookup[obj[parentKey]];
    } else {
      tree.push(newObj);
    }
  }
  return [returnList, tree];
}
