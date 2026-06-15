import type { DoorayApi } from '@dooray-sdk/client';

import { resolveWikiProjectId } from '../../utils/resolve-wiki-project-id';

export interface WikiCommentViewArgs {
  commentId: string;
  id: string;
  projectId?: string;
}

interface WikiCommentViewContext {
  api: DoorayApi;
  args: WikiCommentViewArgs;
}

export async function runWikiCommentView({ api, args }: WikiCommentViewContext) {
  const projectId = await resolveWikiProjectId(api, args);

  const { result } = await api.wikiComment.get({
    path: { commentId: args.commentId, pageId: args.id, wikiId: projectId },
  });

  return { data: result };
}
