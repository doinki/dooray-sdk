import type { DoorayApi } from '@dooray-sdk/client';

export interface StatusListArgs {
  projectId: string;
}

interface ProjectStatusListContext {
  api: DoorayApi;
  args: StatusListArgs;
}

export async function runProjectStatusList(context: ProjectStatusListContext) {
  const {
    api,
    args: { projectId },
  } = context;

  const { result } = await api.projectWorkflow.list({ path: { projectId } });

  return { data: result };
}
