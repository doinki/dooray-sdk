import type { DoorayApi } from '@dooray-sdk/client';

import { resolveWikiProjectId } from '../../utils/resolve-wiki-project-id';

export interface WikiFileDeleteArgs {
  fileId: string;
  id: string;
  projectId?: string;
}

interface WikiFileDeleteContext {
  api: DoorayApi;
  args: WikiFileDeleteArgs;
}

export async function runWikiFileDelete({ api, args }: WikiFileDeleteContext) {
  const projectId = await resolveWikiProjectId(api, args);

  await api.wikiFile.deletePageFile({
    path: { fileId: args.fileId, pageId: args.id, wikiId: projectId },
  });

  return { data: { id: args.fileId } };
}
