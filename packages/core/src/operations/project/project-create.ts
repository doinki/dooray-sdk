import type { DoorayApi } from '@dooray-sdk/client';
import type { ProjectScope } from '@dooray-sdk/client/project';

export interface ProjectCreateArgs {
  categoryId?: string;
  description?: string;
  name: string;
  scope: ProjectScope;
}

interface ProjectCreateContext {
  api: DoorayApi;
  args: ProjectCreateArgs;
}

export async function runProjectCreate(context: ProjectCreateContext) {
  const {
    api,
    args: { categoryId, description, name, scope },
  } = context;

  const { result } = await api.project.create({
    body: {
      code: name,
      description,
      projectCategoryId: categoryId,
      scope,
    },
  });

  return { data: result };
}
