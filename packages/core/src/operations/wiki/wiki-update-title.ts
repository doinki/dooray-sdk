import type { DoorayApi } from '@dooray-sdk/client';

import { resolveWikiProjectId } from '../../utils/resolve-wiki-project-id';

export interface WikiUpdateTitleArgs {
  id: string;
  projectId?: string;
  title: string;
}

interface WikiUpdateTitleContext {
  api: DoorayApi;
  args: WikiUpdateTitleArgs;
}

export async function runWikiUpdateTitle({ api, args }: WikiUpdateTitleContext) {
  const projectId = await resolveWikiProjectId(api, args);

  const { result } = await api.wikiPage.updateTitle({
    body: { subject: args.title },
    path: { pageId: args.id, wikiId: projectId },
  });

  return { data: result };
}
