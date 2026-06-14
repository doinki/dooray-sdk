import type { DoorayApi } from '@dooray-sdk/client';

import { createMemberIdResolver } from '../../utils/resolve-member-id';
import { resolveTaskProjectId } from '../../utils/resolve-task-project-id';

export interface TaskSetAssigneeStatusArgs {
  id: string;
  memberId: string;
  projectId?: string;
  statusId: string;
}

interface TaskSetAssigneeStatusContext {
  api: DoorayApi;
  args: TaskSetAssigneeStatusArgs;
}

export async function runTaskSetAssigneeStatus({ api, args }: TaskSetAssigneeStatusContext) {
  const projectId = await resolveTaskProjectId(api, args);

  const resolveMemberId = createMemberIdResolver(api);
  const memberId = await resolveMemberId(args.memberId);

  await api.projectTask.setAssigneeWorkflow({
    body: { workflowId: args.statusId },
    path: { organizationMemberId: memberId, projectId, taskId: args.id },
  });

  return {
    data: { id: args.id },
  };
}
