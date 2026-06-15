import type { DoorayApi } from '@dooray-sdk/client';

import type { WikiFileTypeInput } from '../../constants/wiki';
import { DEFAULT_WIKI_FILE_TYPE } from '../../constants/wiki';
import { buildMultipartFile } from '../../utils/build-multipart-file';
import { resolveWikiProjectId } from '../../utils/resolve-wiki-project-id';

export interface WikiFileUploadArgs {
  contentType?: string;
  filePath: string;
  id: string;
  projectId?: string;
  type?: WikiFileTypeInput;
}

interface WikiFileUploadContext {
  api: DoorayApi;
  args: WikiFileUploadArgs;
}

export async function runWikiFileUpload({ api, args }: WikiFileUploadContext) {
  const projectId = await resolveWikiProjectId(api, args);

  const form = await buildMultipartFile(args.filePath, args.contentType, { type: args.type ?? DEFAULT_WIKI_FILE_TYPE });

  const { result } = await api.wikiFile.uploadPageFile({ body: form, path: { pageId: args.id, wikiId: projectId } });

  return { data: result };
}
