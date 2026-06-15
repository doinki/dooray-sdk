import type { DoorayApi } from '@dooray-sdk/client';

import { MAX_SIZE } from '../schemas';
import { RefError } from './errors';
import { parseIdRef } from './parse-id-ref';
import type { UrlRefType } from './parse-url-ref';
import { parseUrlRef } from './parse-url-ref';
import { tryParseUrl } from './ref-format';

const WIKI_LIST_MAX_PAGES = 1000;

export function resolveProjectId({ api, ref }: { api: DoorayApi; ref: string }) {
  const trimmed = ref?.trim();
  if (!trimmed) throw new RefError(trimmed);

  const url = tryParseUrl(trimmed);
  return url
    ? Promise.resolve(resolveProjectIdFromUrl({ api, ref: trimmed, url }))
    : Promise.resolve(resolveProjectIdFromNumeric(trimmed));
}

function resolveProjectIdFromNumeric(ref: string) {
  const data = parseIdRef(ref);

  return data.kind === 'numeric' ? data.id : data.projectId;
}

function resolveProjectIdFromUrl({ api, ref, url }: { api: DoorayApi; ref: string; url: URL }) {
  const data = parseUrlRef(url);

  if (data.projectId) return Promise.resolve(data.projectId);
  if (!data.id) throw new RefError(ref);

  return resolveProjectIdFromUrlId({ api, id: data.id, ref, type: data.type });
}

function resolveProjectIdFromUrlId(params: { api: DoorayApi; id: string; ref: string; type: UrlRefType }) {
  if (params.type === 'task') return resolveProjectIdFromTaskId(params);
  if (params.type === 'drive') return resolveProjectIdFromDriveFileId(params);
  return resolveProjectIdFromWikiPageId(params);
}

function resolveProjectIdFromTaskId({ api, id }: { api: DoorayApi; id: string }) {
  return api.projectTask.getById({ path: { taskId: id } }).then((response) => response.result.project.id);
}

async function resolveProjectIdFromDriveFileId({ api, id }: { api: DoorayApi; id: string }) {
  const file = await api.driveFile.getMetaById({ path: { fileId: id } });
  const drive = await api.drive.get({ path: { driveId: file.result.driveId } });
  return drive.result.project.id;
}

async function resolveProjectIdFromWikiPageId({ api, id, ref }: { api: DoorayApi; id: string; ref: string }) {
  const page = await api.wikiPage.getById({ path: { pageId: id } });
  const { wikiId } = page.result;

  for (let pageIndex = 0; pageIndex < WIKI_LIST_MAX_PAGES; pageIndex += 1) {
    // oxlint-disable-next-line no-await-in-loop
    const wikis = await api.wiki.list({ params: { page: pageIndex, size: MAX_SIZE } });
    const match = wikis.result.find((w) => w.id === wikiId);
    if (match) return match.project.id;
    if (!wikis.paging.hasNext) break;
  }

  throw new RefError(ref);
}
