import type { DoorayApi } from '@dooray-sdk/client';

export interface ProjectMemberGroupListArgs {
  page?: number;
  projectId: string;
  size?: number;
}

interface ProjectMemberGroupListContext {
  api: DoorayApi;
  args: ProjectMemberGroupListArgs;
}

export async function runProjectMemberGroupList(context: ProjectMemberGroupListContext) {
  const {
    api,
    args: { page, projectId, size },
  } = context;

  const { paging, result } = await api.projectMemberGroup.list({
    params: { page, size },
    path: { projectId },
  });

  return { data: result, paging };
}
