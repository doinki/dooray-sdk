import type { DoorayApi } from '@dooray-sdk/client';
import type { ProjectMemberAssignableRole } from '@dooray-sdk/client/project';

export interface ProjectMemberAddArgs {
  id: string;
  projectId: string;
  role: ProjectMemberAssignableRole;
}

interface ProjectMemberAddContext {
  api: DoorayApi;
  args: ProjectMemberAddArgs;
}

export async function runProjectMemberAdd(context: ProjectMemberAddContext) {
  const {
    api,
    args: { id, projectId, role },
  } = context;

  const { result } = await api.projectMember.add({
    body: { organizationMemberId: id, role },
    path: { projectId },
  });

  return { data: result };
}
