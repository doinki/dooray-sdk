import type { DoorayApi } from '@dooray-sdk/client';

export async function resolveWikiProjectId(api: DoorayApi, args: { id: string; projectId?: string }): Promise<string> {
  if (args.projectId) return args.projectId;

  const res = await api.wikiPage.getById({ path: { pageId: args.id } });

  return res.result.wikiId;
}
