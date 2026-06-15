import type { DoorayApi } from '@dooray-sdk/client';

import { DEFAULT_BODY_MIME_TYPE } from '../../constants';
import { buildWikiCc } from '../../utils/build-wiki-cc';
import { resolveWikiProjectId } from '../../utils/resolve-wiki-project-id';

export interface WikiUpdateArgs {
  body: string;
  cc: string[];
  id: string;
  projectId?: string;
  title: string;
}

interface WikiUpdateContext {
  api: DoorayApi;
  args: WikiUpdateArgs;
}

export async function runWikiUpdate({ api, args }: WikiUpdateContext) {
  const projectId = await resolveWikiProjectId(api, args);

  const cc = await buildWikiCc(api, args.cc);

  const { result } = await api.wikiPage.update({
    body: {
      body: { content: args.body, mimeType: DEFAULT_BODY_MIME_TYPE },
      referrers: cc,
      subject: args.title,
    },
    path: { pageId: args.id, wikiId: projectId },
  });

  return { data: result };
}
