import type { DoorayApi } from '@dooray-sdk/client';

export interface TagCreateArgs {
  color: string;
  name: string;
  projectId: string;
}

interface ProjectTagCreateContext {
  api: DoorayApi;
  args: TagCreateArgs;
}

export async function runProjectTagCreate(context: ProjectTagCreateContext) {
  const {
    api,
    args: { color, name, projectId },
  } = context;

  const { result } = await api.projectTag.create({
    body: { color, name },
    path: { projectId },
  });

  return { data: result };
}
