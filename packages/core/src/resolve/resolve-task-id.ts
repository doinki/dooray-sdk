import { RefError } from './errors';
import { parseIdRef } from './parse-id-ref';
import { parseUrlRef } from './parse-url-ref';
import { tryParseUrl } from './ref-format';

export interface ResolvedTaskId {
  id: string;
  projectId?: string;
}

export function resolveTaskId({ id, ref }: { id?: string; ref?: string }): ResolvedTaskId {
  const explicitId = id?.trim();
  if (explicitId) return { id: explicitId };

  const trimmed = ref?.trim();
  if (!trimmed) throw new RefError(trimmed);

  const url = tryParseUrl(trimmed);
  return url ? resolveTaskIdFromUrl({ ref: trimmed, url }) : resolveTaskIdFromNumeric(trimmed);
}

function resolveTaskIdFromNumeric(ref: string): ResolvedTaskId {
  const data = parseIdRef(ref);

  return data.kind === 'numeric-pair' ? { id: data.id, projectId: data.projectId } : { id: data.id };
}

function resolveTaskIdFromUrl({ ref, url }: { ref: string; url: URL }): ResolvedTaskId {
  const data = parseUrlRef(url);

  if (data.type !== 'task') throw new RefError(ref);
  if (!data.id) throw new RefError(ref);

  return data.projectId ? { id: data.id, projectId: data.projectId } : { id: data.id };
}
