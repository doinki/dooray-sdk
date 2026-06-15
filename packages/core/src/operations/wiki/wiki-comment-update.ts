import type { DoorayApi } from '@dooray-sdk/client';

import { resolveWikiProjectId } from '../../utils/resolve-wiki-project-id';

export interface WikiCommentUpdateArgs {
  body: string;
  commentId: string;
  id: string;
  projectId?: string;
}

interface WikiCommentUpdateContext {
  api: DoorayApi;
  args: WikiCommentUpdateArgs;
}

export async function runWikiCommentUpdate({ api, args }: WikiCommentUpdateContext) {
  const projectId = await resolveWikiProjectId(api, args);

  const { result } = await api.wikiComment.update({
    body: { body: { content: args.body } },
    path: { commentId: args.commentId, pageId: args.id, wikiId: projectId },
  });

  return { data: result };
}
