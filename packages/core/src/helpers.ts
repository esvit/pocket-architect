// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function createSnapshot<T>(obj: T): T {
  if (obj === null || obj === undefined) {
    return obj;
  }

  // toSnapshot має найвищий пріоритет
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if (typeof (obj as any).toSnapshot === 'function') {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (obj as any).toSnapshot();
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if (typeof (obj as any).toJSON === 'function') {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (obj as any).toJSON();
  }

  // ✅ МАСИВИ
  if (Array.isArray(obj)) {
    return obj.map(item => createSnapshot(item)) as unknown as T;
  }

  // primitives
  if (typeof obj !== 'object') {
    return obj;
  }

  // plain object
  const copy = {} as Record<string, unknown>;

  for (const key of Object.keys(obj as object)) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const value = (obj as any)[key];
    copy[key] = createSnapshot(value);
  }

  return copy as T;
}
