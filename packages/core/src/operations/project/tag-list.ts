import type { DoorayApi } from '@dooray-sdk/client';

export interface TagListArgs {
  page?: number;
  projectId: string;
  size?: number;
}

interface ProjectTagListContext {
  api: DoorayApi;
  args: TagListArgs;
}

export async function runProjectTagList(context: ProjectTagListContext) {
  const {
    api,
    args: { page, projectId, size },
  } = context;

  const { paging, result } = await api.projectTag.list({
    params: { page, size },
    path: { projectId },
  });

  return { data: result, paging };
}
