import type { DoorayApi } from '@dooray-sdk/client';

import { buildWikiCc } from '../../utils/build-wiki-cc';
import { resolveWikiProjectId } from '../../utils/resolve-wiki-project-id';

export interface WikiUpdateArgs {
  body?: string;
  cc?: string[];
  id: string;
  projectId?: string;
  title?: string;
}

interface WikiUpdateContext {
  api: DoorayApi;
  args: WikiUpdateArgs;
}

export async function runWikiUpdate({ api, args }: WikiUpdateContext) {
  const projectId = await resolveWikiProjectId(api, args);
  const { result: page } = await api.wikiPage.getById({ path: { pageId: args.id } });

  const cc = args.cc ? await buildWikiCc(api, args.cc) : page.referrers;

  const { result } = await api.wikiPage.update({
    body: {
      body: { content: args.body ?? page.body.content, mimeType: page.body.mimeType },
      referrers: cc,
      subject: args.title ?? page.subject,
    },
    path: { pageId: args.id, wikiId: projectId },
  });

  return { data: result };
}
