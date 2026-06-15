import type { DoorayApi } from '@dooray-sdk/client';

import { streamResponseToFile } from '../../utils/stream-response-to-file';

export interface WikiProjectFileDownloadArgs {
  attachFileId: string;
  outputPath: string;
  projectId: string;
}

interface WikiProjectFileDownloadContext {
  api: DoorayApi;
  args: WikiProjectFileDownloadArgs;
}

export async function runWikiProjectFileDownload({ api, args }: WikiProjectFileDownloadContext) {
  const { response } = await api.wikiFile.downloadAttachFile({
    path: { attachFileId: args.attachFileId, wikiId: args.projectId },
  });

  const result = await streamResponseToFile(response, args.outputPath);

  return { data: result };
}
