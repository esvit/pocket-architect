export function plainListToTree<T, H>(list:T[], applyFn: (arg: T) => H, childrenKey = 'children', idKey = 'name', parentKey = 'parent'):[H[], H[]] {
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
      lookup[obj[parentKey]][childrenKey].push(newObj);
      newObj[parentKey] = lookup[obj[parentKey]];
    } else {
      tree.push(newObj);
    }
  }
  return [returnList, tree];
}
