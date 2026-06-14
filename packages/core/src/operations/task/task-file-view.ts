import type { DoorayApi } from '@dooray-sdk/client';

import { resolveTaskProjectId } from '../../utils/resolve-task-project-id';

export interface TaskFileViewArgs {
  fileId: string;
  id: string;
  projectId?: string;
}

interface TaskFileViewContext {
  api: DoorayApi;
  args: TaskFileViewArgs;
}

export async function runTaskFileView({ api, args }: TaskFileViewContext) {
  const projectId = await resolveTaskProjectId(api, args);

  const res = await api.projectTaskFile.getMeta({
    path: { fileId: args.fileId, projectId, taskId: args.id },
  });

  return {
    data: res.result,
  };
}
