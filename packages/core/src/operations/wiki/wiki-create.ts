import type { DoorayApi } from '@dooray-sdk/client';

import { DEFAULT_BODY_MIME_TYPE } from '../../constants';
import { buildWikiCc } from '../../utils/build-wiki-cc';

export interface WikiCreateArgs {
  body: string;
  cc?: string[];
  fileIds?: string[];
  parentId: string;
  projectId: string;
  title: string;
}

interface WikiCreateContext {
  api: DoorayApi;
  args: WikiCreateArgs;
}

export async function runWikiCreate({ api, args }: WikiCreateContext) {
  const cc = await buildWikiCc(api, args.cc);

  const { result } = await api.wikiPage.create({
    body: {
      attachFileIds: args.fileIds,
      body: { content: args.body, mimeType: DEFAULT_BODY_MIME_TYPE },
      parentPageId: args.parentId,
      referrers: cc,
      subject: args.title,
    },
    path: { wikiId: args.projectId },
  });

  return { data: result };
}
