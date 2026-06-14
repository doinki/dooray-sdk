import type { DoorayApi } from '@dooray-sdk/client';

import { resolveTaskProjectId } from '../../utils/resolve-task-project-id';

export interface TaskFileDeleteArgs {
  fileId: string;
  id: string;
  projectId?: string;
}

interface TaskFileDeleteContext {
  api: DoorayApi;
  args: TaskFileDeleteArgs;
}

export async function runTaskFileDelete({ api, args }: TaskFileDeleteContext) {
  const projectId = await resolveTaskProjectId(api, args);

  await api.projectTaskFile.delete({ path: { fileId: args.fileId, projectId, taskId: args.id } });

  return {
    data: { id: args.fileId },
  };
}
