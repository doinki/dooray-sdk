import type { DoorayApi } from '@dooray-sdk/client';

import { resolveTaskProjectId } from '../../utils/resolve-task-project-id';

export interface TaskSetStatusArgs {
  id: string;
  projectId?: string;
  statusId: string;
}

interface TaskSetStatusContext {
  api: DoorayApi;
  args: TaskSetStatusArgs;
}

export async function runTaskSetStatus({ api, args }: TaskSetStatusContext) {
  const projectId = await resolveTaskProjectId(api, args);

  await api.projectTask.setWorkflow({
    body: { workflowId: args.statusId },
    path: { projectId, taskId: args.id },
  });

  return {
    data: { id: args.id },
  };
}
