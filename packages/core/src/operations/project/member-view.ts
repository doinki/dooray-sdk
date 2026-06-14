import type { DoorayApi } from '@dooray-sdk/client';

export interface ProjectMemberViewArgs {
  id: string;
  projectId: string;
}

interface ProjectMemberViewContext {
  api: DoorayApi;
  args: ProjectMemberViewArgs;
}

export async function runProjectMemberView(context: ProjectMemberViewContext) {
  const {
    api,
    args: { id, projectId },
  } = context;

  const { result } = await api.projectMember.get({ path: { memberId: id, projectId } });

  return { data: result };
}
