import type { DoorayApi } from '@dooray-sdk/client';

import { resolveTaskProjectId } from '../../utils/resolve-task-project-id';

export interface TaskCloseArgs {
  id: string;
  projectId?: string;
}

interface TaskCloseContext {
  api: DoorayApi;
  args: TaskCloseArgs;
}

export async function runTaskClose({ api, args }: TaskCloseContext) {
  const projectId = await resolveTaskProjectId(api, args);

  await api.projectTask.setDone({ path: { projectId, taskId: args.id } });

  return {
    data: { id: args.id },
  };
}
