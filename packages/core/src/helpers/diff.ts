export type DiffKind = 'added' | 'removed' | 'changed';

export type PathSegment =
  | { type: 'key'; key: string }
  | { type: 'index'; index: number };

export interface DiffEntry {
  path: string;
  segments: PathSegment[];
  kind: DiffKind;
  before?: unknown;
  after?: unknown;
}

export interface LabelContext {
  key: string | null;     // назва поля (останній key)
  index: number | null;   // індекс масиву, якщо зміна всередині масиву
  path: string;           // items[2].price
  segments: PathSegment[];
  entry: DiffEntry;
}

export interface DiffFormatterOptions {
  /**
   * - string → label (людська назва поля)
   * - null → ignore
   * - undefined → fallback на path
   */
  resolveLabel?: (ctx: LabelContext) => string | null | undefined;

  formatValue?: (value: unknown, ctx: LabelContext) => string;
}

export interface DiffViewModel {
  kind: DiffKind;
  label: string;
  path: string;
  index: number | null;

  beforeRaw?: unknown;
  afterRaw?: unknown;

  before?: string;
  after?: string;
}

export function diffObjects(before: unknown, after: unknown): DiffEntry[] {
  const diffs: DiffEntry[] = [];
  walk(before, after, [], diffs);
  return diffs;
}

function walk(
  before: unknown,
  after: unknown,
  segments: PathSegment[],
  out: DiffEntry[]
): void {
  if (Object.is(before, after)) return;

  const isPlainObject = (v: unknown) =>
    typeof v === 'object' && v !== null && !Array.isArray(v);

  // arrays
  if (Array.isArray(before) || Array.isArray(after)) {
    const bArr = Array.isArray(before) ? before : [];
    const aArr = Array.isArray(after) ? after : [];
    const max = Math.max(bArr.length, aArr.length);

    for (let i = 0; i < max; i++) {
      walk(bArr[i], aArr[i], [...segments, { type: 'index', index: i }], out);
    }
    return;
  }

  // primitives or mismatched types
  if (!isPlainObject(before) || !isPlainObject(after)) {
    out.push({
      path: segmentsToPath(segments),
      segments,
      kind: 'changed',
      before,
      after,
    });
    return;
  }

  // objects
  const bObj = before as Record<string, unknown>;
  const aObj = after as Record<string, unknown>;
  const keys = [...Object.keys(bObj), ...Object.keys(aObj)];

  for (const key of keys) {
    const b = bObj[key];
    const a = aObj[key];
    const nextSeg = [...segments, { type: 'key', key } as const];

    if (b === undefined && a !== undefined) {
      out.push({
        path: segmentsToPath(nextSeg),
        segments: nextSeg,
        kind: 'added',
        after: a,
      });
      continue;
    }

    if (b !== undefined && a === undefined) {
      out.push({
        path: segmentsToPath(nextSeg),
        segments: nextSeg,
        kind: 'removed',
        before: b,
      });
      continue;
    }

    walk(b, a, nextSeg, out);
  }
}

function segmentsToPath(segments: PathSegment[]): string {
  let path = '';
  for (const s of segments) {
    if (s.type === 'key') {
      path += path ? `.${s.key}` : s.key;
    } else {
      path += `[${s.index}]`;
    }
  }
  return path || '';
}

function buildLabelContext(entry: DiffEntry): LabelContext {
  let key: string | null = null;
  let index: number | null = null;

  for (let i = entry.segments.length - 1; i >= 0; i--) {
    const s = entry.segments[i];
    if (s.type === 'key') {
      key = s.key;
      break;
    }
  }

  for (let i = entry.segments.length - 1; i >= 0; i--) {
    const s = entry.segments[i];
    if (s.type === 'index') {
      index = s.index;
      break;
    }
  }

  return {
    key,
    index,
    path: entry.path,
    segments: entry.segments,
    entry,
  };
}

function defaultStringify(value: unknown): string {
  if (typeof value === 'string') return `"${value}"`;
  if (typeof value === 'boolean') return value ? 'true' : 'false';
  if (value === null) return 'null';
  if (typeof value === 'object') return JSON.stringify(value);
  return String(value);
}

export function buildDiffViewModel(
  diffs: DiffEntry[],
  options: DiffFormatterOptions
): DiffViewModel[] {
  const { resolveLabel, formatValue = defaultStringify } = options;

  const seen = new Set<string>();
  const result: DiffViewModel[] = [];

  for (const entry of diffs) {
    const ctx = buildLabelContext(entry);

    const resolvedLabel = resolveLabel?.(ctx);
    if (resolvedLabel === null) continue;

    const label = resolvedLabel ?? entry.path;

    const beforeFormatted =
      entry.before !== undefined ? formatValue(entry.before, ctx) : undefined;

    const afterFormatted =
      entry.after !== undefined ? formatValue(entry.after, ctx) : undefined;

    // якщо форматовано однаково — не зміна
    if (entry.kind === 'changed' && beforeFormatted === afterFormatted) {
      continue;
    }

    // 👇 КЛЮЧ ДЕДУПЛІКАЦІЇ
    const dedupeKey = `${entry.kind}|${entry.path}`;

    if (seen.has(dedupeKey)) {
      continue;
    }
    seen.add(dedupeKey);

    result.push({
      kind: entry.kind,
      label,
      path: entry.path,
      index: ctx.index,
      beforeRaw: entry.before,
      afterRaw: entry.after,
      before: beforeFormatted,
      after: afterFormatted,
    });
  }

  return result;
}
