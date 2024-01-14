export function plainListToTree<T>(list:T[], childrenKey = 'children', idKey = 'name', parentKey = 'parent'):T[] {
  const tree = [];
  const lookup:Record<string, T> = {};
  for (const obj of list) {
    lookup[obj[idKey]] = obj;
    obj[childrenKey] = [];
  }
  for (const obj of list) {
    if (obj[parentKey]) {
      lookup[obj[parentKey]][childrenKey].push(obj);
    } else {
      tree.push(obj);
    }
  }
  return tree;
}
