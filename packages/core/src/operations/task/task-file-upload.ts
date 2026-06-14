import type { DoorayApi } from '@dooray-sdk/client';

import { buildMultipartFile } from '../../utils/build-multipart-file';
import { resolveTaskProjectId } from '../../utils/resolve-task-project-id';

export interface TaskFileUploadArgs {
  contentType?: string;
  filePath: string;
  id: string;
  projectId?: string;
}

interface TaskFileUploadContext {
  api: DoorayApi;
  args: TaskFileUploadArgs;
}

export async function runTaskFileUpload({ api, args }: TaskFileUploadContext) {
  const projectId = await resolveTaskProjectId(api, args);
  const form = await buildMultipartFile(args.filePath, args.contentType);

  const res = await api.projectTaskFile.upload({ body: form, path: { projectId, taskId: args.id } });

  return {
    data: { id: res.result.id },
  };
}
