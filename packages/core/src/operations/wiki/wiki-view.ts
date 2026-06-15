import type { DoorayApi } from '@dooray-sdk/client';

export interface WikiViewArgs {
  id: string;
  projectId?: string;
}

interface WikiViewContext {
  api: DoorayApi;
  args: WikiViewArgs;
}

export async function runWikiView({ api, args }: WikiViewContext) {
  const { result } = args.projectId
    ? await api.wikiPage.get({ path: { pageId: args.id, wikiId: args.projectId } })
    : await api.wikiPage.getById({ path: { pageId: args.id } });

  return { data: result };
}
