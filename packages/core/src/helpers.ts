// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function createSnapshot<T>(obj: T): T {
  if (!obj) {
    return obj;
  }
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  if (typeof obj.toSnapshot === 'function') {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return obj.toSnapshot() as T;
  }
  const copy:T = {} as T;
  for (const key in obj) {
    if (!Object.prototype.hasOwnProperty.call(obj, key)) {
      continue;
    }
    if (typeof obj[key] !== 'object') {
      copy[key] = obj[key];
      continue;
    }
    copy[key] = createSnapshot(obj[key]);
  }
  return copy;
}
