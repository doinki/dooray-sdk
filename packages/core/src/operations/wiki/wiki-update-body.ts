import type { DoorayApi } from '@dooray-sdk/client';

import { DEFAULT_BODY_MIME_TYPE } from '../../constants';
import { resolveWikiProjectId } from '../../utils/resolve-wiki-project-id';

export interface WikiUpdateBodyArgs {
  body: string;
  id: string;
  projectId?: string;
}

interface WikiUpdateBodyContext {
  api: DoorayApi;
  args: WikiUpdateBodyArgs;
}

export async function runWikiUpdateBody({ api, args }: WikiUpdateBodyContext) {
  const projectId = await resolveWikiProjectId(api, args);

  const { result } = await api.wikiPage.updateContent({
    body: { body: { content: args.body, mimeType: DEFAULT_BODY_MIME_TYPE } },
    path: { pageId: args.id, wikiId: projectId },
  });

  return { data: result };
}
