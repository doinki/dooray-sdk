import type { DoorayApi } from '@dooray-sdk/client';

import { resolveWikiProjectId } from '../../utils/resolve-wiki-project-id';

export interface WikiDeleteArgs {
  id: string;
  projectId?: string;
}

interface WikiDeleteContext {
  api: DoorayApi;
  args: WikiDeleteArgs;
}

export async function runWikiDelete({ api, args }: WikiDeleteContext) {
  const projectId = await resolveWikiProjectId(api, args);

  await api.wikiPage.delete({ path: { pageId: args.id, wikiId: projectId } });

  return { data: { id: args.id } };
}
