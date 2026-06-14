import type { DoorayApi } from '@dooray-sdk/client';

export interface MilestoneDeleteArgs {
  id: string;
  projectId: string;
}

interface ProjectMilestoneDeleteContext {
  api: DoorayApi;
  args: MilestoneDeleteArgs;
}

export async function runProjectMilestoneDelete(context: ProjectMilestoneDeleteContext) {
  const {
    api,
    args: { id, projectId },
  } = context;

  await api.projectMilestone.delete({
    path: { milestoneId: id, projectId },
  });

  return { data: { id } };
}
