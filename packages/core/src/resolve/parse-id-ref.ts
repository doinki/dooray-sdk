import { RefError } from './errors';
import { DOORAY_ID_PAIR_PATTERN, DOORAY_ID_PATTERN } from './ref-format';

export type IdRef = { id: string; kind: 'numeric-pair'; projectId: string } | { id: string; kind: 'numeric' };

export function parseIdRef(ref: string): IdRef {
  const trimmed = ref.trim();

  const pair = DOORAY_ID_PAIR_PATTERN.exec(trimmed);
  if (pair) return { id: pair[2], kind: 'numeric-pair', projectId: pair[1] };

  if (DOORAY_ID_PATTERN.test(trimmed)) return { id: trimmed, kind: 'numeric' };

  throw new RefError(ref);
}
