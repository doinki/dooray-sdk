import type { DoorayApi } from '@dooray-sdk/client';

import { resolveTaskProjectId } from '../../utils/resolve-task-project-id';

export interface TaskFileListArgs {
  id: string;
  projectId?: string;
}

interface TaskFileListContext {
  api: DoorayApi;
  args: TaskFileListArgs;
}

export async function runTaskFileList({ api, args }: TaskFileListContext) {
  const projectId = await resolveTaskProjectId(api, args);

  const res = await api.projectTaskFile.list({ path: { projectId, taskId: args.id } });

  return { data: res.result };
}
