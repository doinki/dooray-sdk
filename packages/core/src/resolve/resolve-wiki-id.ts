import { RefError } from './errors';
import { parseIdRef } from './parse-id-ref';
import { parseUrlRef } from './parse-url-ref';
import { tryParseUrl } from './ref-format';

export interface ResolvedWikiId {
  id: string;
  projectId?: string;
}

export function resolveWikiId({ id, ref }: { id?: string; ref?: string }): ResolvedWikiId {
  const explicitId = id?.trim();
  if (explicitId) return { id: explicitId };

  const trimmed = ref?.trim();
  if (!trimmed) throw new RefError(trimmed);

  const url = tryParseUrl(trimmed);
  return url ? resolveWikiIdFromUrl({ ref: trimmed, url }) : resolveWikiIdFromNumeric(trimmed);
}

function resolveWikiIdFromNumeric(ref: string): ResolvedWikiId {
  const data = parseIdRef(ref);

  return data.kind === 'numeric-pair' ? { id: data.id, projectId: data.projectId } : { id: data.id };
}

function resolveWikiIdFromUrl({ ref, url }: { ref: string; url: URL }): ResolvedWikiId {
  const data = parseUrlRef(url);

  if (data.type !== 'wiki') throw new RefError(ref);
  if (!data.id) throw new RefError(ref);

  return data.projectId ? { id: data.id, projectId: data.projectId } : { id: data.id };
}
