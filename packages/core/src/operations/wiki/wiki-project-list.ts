import type { DoorayApi } from '@dooray-sdk/client';

import { MAX_SIZE } from '../../schemas';
import { fetchAllPages } from '../../utils/fetch-all-pages';

export interface WikiProjectListArgs {
  all?: boolean;
  page?: number;
  size?: number;
}

interface WikiProjectListContext {
  api: DoorayApi;
  args: WikiProjectListArgs;
}

export async function runWikiProjectList({ api, args }: WikiProjectListContext) {
  if (args.all) {
    const { paging, result } = await fetchAllPages((page) => api.wiki.list({ params: { page, size: MAX_SIZE } }));

    return { data: result, paging };
  }

  const { paging, result } = await api.wiki.list({ params: { page: args.page, size: args.size } });

  return { data: result, paging };
}
