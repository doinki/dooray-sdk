import type { DoorayApi } from '@dooray-sdk/client';

import { resolveWikiProjectId } from '../../utils/resolve-wiki-project-id';

export interface WikiCommentDeleteArgs {
  commentId: string;
  id: string;
  projectId?: string;
}

interface WikiCommentDeleteContext {
  api: DoorayApi;
  args: WikiCommentDeleteArgs;
}

export async function runWikiCommentDelete({ api, args }: WikiCommentDeleteContext) {
  const projectId = await resolveWikiProjectId(api, args);

  await api.wikiComment.delete({
    path: { commentId: args.commentId, pageId: args.id, wikiId: projectId },
  });

  return { data: { id: args.commentId } };
}
