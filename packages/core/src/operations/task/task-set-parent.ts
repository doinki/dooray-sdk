import type { DoorayApi } from '@dooray-sdk/client';

import { resolveTaskProjectId } from '../../utils/resolve-task-project-id';

export interface TaskSetParentArgs {
  id: string;
  parentId: string;
  projectId?: string;
}

interface TaskSetParentContext {
  api: DoorayApi;
  args: TaskSetParentArgs;
}

export async function runTaskSetParent({ api, args }: TaskSetParentContext) {
  const projectId = await resolveTaskProjectId(api, args);

  const res = await api.projectTask.setParent({
    body: { parentPostId: args.parentId },
    path: { projectId, taskId: args.id },
  });

  return { data: res.result };
}
