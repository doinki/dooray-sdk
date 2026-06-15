import type { DoorayApi } from '@dooray-sdk/client';

import { resolveWikiProjectId } from '../../utils/resolve-wiki-project-id';

export interface WikiCommentCreateArgs {
  body: string;
  id: string;
  projectId?: string;
}

interface WikiCommentCreateContext {
  api: DoorayApi;
  args: WikiCommentCreateArgs;
}

export async function runWikiCommentCreate({ api, args }: WikiCommentCreateContext) {
  const projectId = await resolveWikiProjectId(api, args);

  const { result } = await api.wikiComment.create({
    body: { body: { content: args.body } },
    path: { pageId: args.id, wikiId: projectId },
  });

  return { data: result };
}
