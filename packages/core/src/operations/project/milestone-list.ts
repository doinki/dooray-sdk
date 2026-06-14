import type { DoorayApi } from '@dooray-sdk/client';

import type { MilestoneState } from '../../constants/milestone';

export interface MilestoneListArgs {
  page?: number;
  projectId: string;
  size?: number;
  state?: MilestoneState;
}

interface ProjectMilestoneListContext {
  api: DoorayApi;
  args: MilestoneListArgs;
}

export async function runProjectMilestoneList(context: ProjectMilestoneListContext) {
  const {
    api,
    args: { page, projectId, size, state },
  } = context;

  const { paging, result } = await api.projectMilestone.list({
    params: { page, size, status: state },
    path: { projectId },
  });

  return { data: result, paging };
}
