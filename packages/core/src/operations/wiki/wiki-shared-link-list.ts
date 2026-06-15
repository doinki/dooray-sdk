import type { DoorayApi } from '@dooray-sdk/client';

import type { WikiSharedLinkState } from '../../constants/wiki';
import { MAX_SIZE } from '../../schemas';
import { fetchAllPages } from '../../utils/fetch-all-pages';
import { resolveWikiProjectId } from '../../utils/resolve-wiki-project-id';

export interface WikiSharedLinkListArgs {
  all?: boolean;
  id: string;
  page?: number;
  projectId?: string;
  size?: number;
  state?: WikiSharedLinkState;
}

interface WikiSharedLinkListContext {
  api: DoorayApi;
  args: WikiSharedLinkListArgs;
}

export async function runWikiSharedLinkList({ api, args }: WikiSharedLinkListContext) {
  const projectId = await resolveWikiProjectId(api, args);
  const valid = args.state === undefined ? undefined : args.state === 'valid';

  if (args.all) {
    const { paging, result } = await fetchAllPages((page) =>
      api.wikiPage.listSharedLinks({
        params: { page, size: MAX_SIZE, valid },
        path: { pageId: args.id, wikiId: projectId },
      }),
    );

    return { data: result, paging };
  }

  const { paging, result } = await api.wikiPage.listSharedLinks({
    params: { page: args.page, size: args.size, valid },
    path: { pageId: args.id, wikiId: projectId },
  });

  return { data: result, paging };
}
