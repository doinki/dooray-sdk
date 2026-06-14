import type { DoorayApi } from '@dooray-sdk/client';

export interface TagViewArgs {
  id: string;
  projectId: string;
}

interface ProjectTagViewContext {
  api: DoorayApi;
  args: TagViewArgs;
}

export async function runProjectTagView(context: ProjectTagViewContext) {
  const {
    api,
    args: { id, projectId },
  } = context;

  const { result } = await api.projectTag.get({ path: { projectId, tagId: id } });

  return { data: result };
}
