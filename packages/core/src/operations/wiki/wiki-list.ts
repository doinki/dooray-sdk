import type { DoorayApi } from '@dooray-sdk/client';

export interface WikiListArgs {
  parentId?: string;
  projectId: string;
}

interface WikiListContext {
  api: DoorayApi;
  args: WikiListArgs;
}

export async function runWikiList({ api, args }: WikiListContext) {
  const { result } = await api.wikiPage.list({
    params: { parentPageId: args.parentId },
    path: { wikiId: args.projectId },
  });

  return { data: result };
}
