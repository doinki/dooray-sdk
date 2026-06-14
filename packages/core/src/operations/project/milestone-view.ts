import type { DoorayApi } from '@dooray-sdk/client';

export interface MilestoneViewArgs {
  id: string;
  projectId: string;
}

interface ProjectMilestoneViewContext {
  api: DoorayApi;
  args: MilestoneViewArgs;
}

export async function runProjectMilestoneView(context: ProjectMilestoneViewContext) {
  const {
    api,
    args: { id, projectId },
  } = context;

  const { result } = await api.projectMilestone.get({
    path: { milestoneId: id, projectId },
  });

  return { data: result };
}
