import type { DoorayApi } from '@dooray-sdk/client';

export interface StatusDeleteArgs {
  id: string;
  moveTo: string;
  projectId: string;
}

interface ProjectStatusDeleteContext {
  api: DoorayApi;
  args: StatusDeleteArgs;
}

export async function runProjectStatusDelete(context: ProjectStatusDeleteContext) {
  const {
    api,
    args: { id, moveTo, projectId },
  } = context;

  await api.projectWorkflow.delete({
    body: { toBeWorkflowId: moveTo },
    path: { projectId, workflowId: id },
  });

  return { data: { id } };
}
