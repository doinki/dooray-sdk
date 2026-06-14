import type { DoorayApi } from '@dooray-sdk/client';

export interface TemplateListArgs {
  page?: number;
  projectId: string;
  size?: number;
}

interface ProjectTemplateListContext {
  api: DoorayApi;
  args: TemplateListArgs;
}

export async function runProjectTemplateList(context: ProjectTemplateListContext) {
  const {
    api,
    args: { page, projectId, size },
  } = context;

  const { paging, result } = await api.projectTemplate.list({
    params: { page, size },
    path: { projectId },
  });

  return { data: result, paging };
}
