import type { DoorayApi } from '@dooray-sdk/client';

export interface TemplateDeleteArgs {
  id: string;
  projectId: string;
}

interface ProjectTemplateDeleteContext {
  api: DoorayApi;
  args: TemplateDeleteArgs;
}

export async function runProjectTemplateDelete(context: ProjectTemplateDeleteContext) {
  const {
    api,
    args: { id, projectId },
  } = context;

  await api.projectTemplate.delete({ path: { projectId, templateId: id } });

  return { data: { id } };
}
