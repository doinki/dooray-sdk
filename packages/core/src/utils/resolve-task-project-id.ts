import type { DoorayApi } from '@dooray-sdk/client';

export async function resolveTaskProjectId(api: DoorayApi, args: { id: string; projectId?: string }): Promise<string> {
  if (args.projectId) return args.projectId;

  const res = await api.projectTask.getById({ path: { taskId: args.id } });

  return res.result.project.id;
}
