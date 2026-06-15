import type { DoorayApi } from '@dooray-sdk/client';

import { resolveWikiProjectId } from '../../utils/resolve-wiki-project-id';

export interface WikiMoveArgs {
  beforeId?: string;
  id: string;
  includeSubPages?: boolean;
  parentId: string;
  projectId?: string;
  targetProjectId?: string;
}

interface WikiMoveContext {
  api: DoorayApi;
  args: WikiMoveArgs;
}

export async function runWikiMove({ api, args }: WikiMoveContext) {
  const projectId = await resolveWikiProjectId(api, args);

  const { result } = await api.wikiPage.move({
    body: {
      beforePageId: args.beforeId,
      targetParentPageId: args.parentId,
      targetWikiId: args.targetProjectId,
      withChildren: args.includeSubPages,
    },
    path: { pageId: args.id, wikiId: projectId },
  });

  return { data: result };
}
