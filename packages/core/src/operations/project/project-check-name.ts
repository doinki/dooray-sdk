import type { DoorayApi } from '@dooray-sdk/client';

export interface ProjectCheckNameArgs {
  name: string;
}

interface ProjectCheckNameContext {
  api: DoorayApi;
  args: ProjectCheckNameArgs;
}

export async function runProjectCheckName(context: ProjectCheckNameContext) {
  const {
    api,
    args: { name },
  } = context;

  await api.project.checkCreatable({ body: { code: name } });

  return { data: { name } };
}
