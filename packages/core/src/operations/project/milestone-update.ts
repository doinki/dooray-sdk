import type { DoorayApi } from '@dooray-sdk/client';
import type { MilestoneUpdateBody } from '@dooray-sdk/client/project';

import type { MilestoneState } from '../../constants/milestone';

export interface MilestoneUpdateArgs {
  endDate?: string;
  id: string;
  name?: string;
  projectId: string;
  startDate?: string;
  state?: MilestoneState;
}

interface ProjectMilestoneUpdateContext {
  api: DoorayApi;
  args: MilestoneUpdateArgs;
}

export async function runProjectMilestoneUpdate(context: ProjectMilestoneUpdateContext) {
  const {
    api,
    args: { endDate, id, name, projectId, startDate, state },
  } = context;

  const body: MilestoneUpdateBody = {};
  if (endDate !== undefined) body.endedAt = endDate;
  if (name !== undefined) body.name = name;
  if (startDate !== undefined) body.startedAt = startDate;
  if (state !== undefined) body.status = state;

  await api.projectMilestone.update({
    body,
    path: { milestoneId: id, projectId },
  });

  return { data: { id } };
}
