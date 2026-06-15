import type { DoorayApi } from '@dooray-sdk/client';

import type { WikiFileTypeInput } from '../../constants/wiki';
import { DEFAULT_WIKI_FILE_TYPE } from '../../constants/wiki';
import { buildMultipartFile } from '../../utils/build-multipart-file';

export interface WikiProjectFileUploadArgs {
  contentType?: string;
  filePath: string;
  projectId: string;
  type?: WikiFileTypeInput;
}

interface WikiProjectFileUploadContext {
  api: DoorayApi;
  args: WikiProjectFileUploadArgs;
}

export async function runWikiProjectFileUpload({ api, args }: WikiProjectFileUploadContext) {
  const form = await buildMultipartFile(args.filePath, args.contentType, { type: args.type ?? DEFAULT_WIKI_FILE_TYPE });

  const { result } = await api.wikiFile.upload({ body: form, path: { wikiId: args.projectId } });

  return { data: result };
}
