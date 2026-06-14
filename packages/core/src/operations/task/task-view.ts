import type { DoorayApi } from '@dooray-sdk/client';

export interface TaskViewArgs {
  id: string;
  projectId?: string;
}

interface TaskViewContext {
  api: DoorayApi;
  args: TaskViewArgs;
}

export async function runTaskView({ api, args }: TaskViewContext) {
  const { result } = args.projectId
    ? await api.projectTask.get({ path: { projectId: args.projectId, taskId: args.id } })
    : await api.projectTask.getById({ path: { taskId: args.id } });

  return { data: result };
}
