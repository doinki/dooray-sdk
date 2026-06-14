import type { DoorayApi } from '@dooray-sdk/client';

export interface TemplateViewArgs {
  expand?: boolean;
  id: string;
  projectId: string;
}

interface ProjectTemplateViewContext {
  api: DoorayApi;
  args: TemplateViewArgs;
}

export async function runProjectTemplateView(context: ProjectTemplateViewContext) {
  const {
    api,
    args: { expand, id, projectId },
  } = context;

  const { result } = await api.projectTemplate.get({
    params: { interpolation: expand },
    path: { projectId, templateId: id },
  });

  return { data: result };
}
