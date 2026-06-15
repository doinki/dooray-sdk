import type { DoorayApi } from '@dooray-sdk/client';

import { resolveWikiProjectId } from '../../utils/resolve-wiki-project-id';
import { streamResponseToFile } from '../../utils/stream-response-to-file';

export interface WikiFileDownloadArgs {
  fileId: string;
  id: string;
  outputPath: string;
  projectId?: string;
}

interface WikiFileDownloadContext {
  api: DoorayApi;
  args: WikiFileDownloadArgs;
}

export async function runWikiFileDownload({ api, args }: WikiFileDownloadContext) {
  const projectId = await resolveWikiProjectId(api, args);

  const { response } = await api.wikiFile.downloadPageFile({
    path: { fileId: args.fileId, pageId: args.id, wikiId: projectId },
  });

  const result = await streamResponseToFile(response, args.outputPath);

  return { data: result };
}
