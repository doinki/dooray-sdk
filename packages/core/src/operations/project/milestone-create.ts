import type { DoorayApi } from '@dooray-sdk/client';

export interface MilestoneCreateArgs {
  endDate?: string;
  name: string;
  projectId: string;
  startDate?: string;
}

interface ProjectMilestoneCreateContext {
  api: DoorayApi;
  args: MilestoneCreateArgs;
}

export async function runProjectMilestoneCreate(context: ProjectMilestoneCreateContext) {
  const {
    api,
    args: { endDate, name, projectId, startDate },
  } = context;

  const { result } = await api.projectMilestone.create({
    body: { endedAt: endDate ?? null, name, startedAt: startDate ?? null },
    path: { projectId },
  });

  return { data: result };
}
