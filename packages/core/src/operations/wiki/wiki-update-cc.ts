import type { DoorayApi } from '@dooray-sdk/client';

import { buildWikiCc } from '../../utils/build-wiki-cc';
import { resolveWikiProjectId } from '../../utils/resolve-wiki-project-id';

export interface WikiUpdateCcArgs {
  cc: string[];
  id: string;
  projectId?: string;
}

interface WikiUpdateCcContext {
  api: DoorayApi;
  args: WikiUpdateCcArgs;
}

export async function runWikiUpdateCc({ api, args }: WikiUpdateCcContext) {
  const projectId = await resolveWikiProjectId(api, args);

  const cc = await buildWikiCc(api, args.cc);

  const { result } = await api.wikiPage.updateReferrers({
    body: { referrers: cc },
    path: { pageId: args.id, wikiId: projectId },
  });

  return { data: result };
}
