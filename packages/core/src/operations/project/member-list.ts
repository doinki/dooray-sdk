import type { DoorayApi } from '@dooray-sdk/client';
import type { ProjectMemberAssignableRole } from '@dooray-sdk/client/project';

export interface ProjectMemberListArgs {
  page?: number;
  projectId: string;
  roles?: ProjectMemberAssignableRole[];
  size?: number;
}

interface ProjectMemberListContext {
  api: DoorayApi;
  args: ProjectMemberListArgs;
}

export async function runProjectMemberList(context: ProjectMemberListContext) {
  const {
    api,
    args: { page, projectId, roles, size },
  } = context;

  const { paging, result } = await api.projectMember.list({
    params: { page, roles, size },
    path: { projectId },
  });

  return { data: result, paging };
}
