import type { DoorayApi } from '@dooray-sdk/client';

import { buildMultipartFile } from '../../utils/build-multipart-file';

export interface TaskUploadDraftFileArgs {
  contentType?: string;
  draftId: string;
  filePath: string;
}

interface TaskUploadDraftFileContext {
  api: DoorayApi;
  args: TaskUploadDraftFileArgs;
}

export async function runTaskUploadDraftFile({ api, args }: TaskUploadDraftFileContext) {
  const form = await buildMultipartFile(args.filePath, args.contentType);

  const res = await api.projectTask.uploadDraftFile({ body: form, path: { draftId: args.draftId } });

  return {
    data: { id: res.result.id },
  };
}
