import type { DoorayApi } from '@dooray-sdk/client';

import { resolveTaskProjectId } from '../../utils/resolve-task-project-id';
import { streamResponseToFile } from '../../utils/stream-response-to-file';

export interface TaskFileDownloadArgs {
  fileId: string;
  id: string;
  outputPath: string;
  projectId?: string;
}

interface TaskFileDownloadContext {
  api: DoorayApi;
  args: TaskFileDownloadArgs;
}

export async function runTaskFileDownload({ api, args }: TaskFileDownloadContext) {
  const projectId = await resolveTaskProjectId(api, args);

  const { response } = await api.projectTaskFile.download({
    path: { fileId: args.fileId, projectId, taskId: args.id },
  });

  const data = await streamResponseToFile(response, args.outputPath);

  return { data };
}
