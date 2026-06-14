import type { DoorayApi } from '@dooray-sdk/client';

import { resolveTaskProjectId } from '../../utils/resolve-task-project-id';

export interface TaskMoveArgs {
  id: string;
  includeSubTasks?: boolean;
  projectId?: string;
  targetProjectId: string;
}

interface TaskMoveContext {
  api: DoorayApi;
  args: TaskMoveArgs;
}

export async function runTaskMove({ api, args }: TaskMoveContext) {
  const projectId = await resolveTaskProjectId(api, args);

  const res = await api.projectTask.move({
    body: { includeSubPosts: args.includeSubTasks, targetProjectId: args.targetProjectId },
    path: { projectId, taskId: args.id },
  });

  return {
    data: res.result,
  };
}
