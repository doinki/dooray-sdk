import type { DoorayApi } from '@dooray-sdk/client';

export interface ProjectMemberGroupViewArgs {
  id: string;
  projectId: string;
}

interface ProjectMemberGroupViewContext {
  api: DoorayApi;
  args: ProjectMemberGroupViewArgs;
}

export async function runProjectMemberGroupView(context: ProjectMemberGroupViewContext) {
  const {
    api,
    args: { id, projectId },
  } = context;

  const { result } = await api.projectMemberGroup.get({
    path: { memberGroupId: id, projectId },
  });

  return { data: result };
}
