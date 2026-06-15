import type { DoorayApi } from '@dooray-sdk/client';

import { MAX_SIZE } from '../../schemas';
import { fetchAllPages } from '../../utils/fetch-all-pages';
import { resolveWikiProjectId } from '../../utils/resolve-wiki-project-id';

export interface WikiCommentListArgs {
  all?: boolean;
  id: string;
  page?: number;
  projectId?: string;
  size?: number;
}

interface WikiCommentListContext {
  api: DoorayApi;
  args: WikiCommentListArgs;
}

export async function runWikiCommentList({ api, args }: WikiCommentListContext) {
  const projectId = await resolveWikiProjectId(api, args);

  if (args.all) {
    const { paging, result } = await fetchAllPages((page) =>
      api.wikiComment.list({
        params: { page, size: MAX_SIZE },
        path: { pageId: args.id, wikiId: projectId },
      }),
    );

    return { data: result, paging };
  }

  const { paging, result } = await api.wikiComment.list({
    params: { page: args.page, size: args.size },
    path: { pageId: args.id, wikiId: projectId },
  });

  return { data: result, paging };
}
