import type { DoorayApi } from '@dooray-sdk/client';

export interface EmailViewArgs {
  id: string;
  projectId: string;
}

interface ProjectEmailViewContext {
  api: DoorayApi;
  args: EmailViewArgs;
}

export async function runProjectEmailView(context: ProjectEmailViewContext) {
  const {
    api,
    args: { id, projectId },
  } = context;

  const { result } = await api.projectEmailAddress.get({
    path: { emailAddressId: id, projectId },
  });

  return { data: result };
}
