import type { DoorayApi } from '@dooray-sdk/client';

export interface EmailCreateArgs {
  email: string;
  name: string;
  projectId: string;
}

interface ProjectEmailCreateContext {
  api: DoorayApi;
  args: EmailCreateArgs;
}

export async function runProjectEmailCreate(context: ProjectEmailCreateContext) {
  const {
    api,
    args: { email, name, projectId },
  } = context;

  const { result } = await api.projectEmailAddress.create({
    body: { emailAddress: email, name },
    path: { projectId },
  });

  return { data: result };
}
