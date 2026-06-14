import type { DoorayApi } from '@dooray-sdk/client';

import type { StatusClass, StatusLocaleName } from '../../constants/status';

export interface StatusUpdateArgs {
  class?: StatusClass;
  id: string;
  localeNames?: StatusLocaleName[];
  name?: string;
  order?: number;
  projectId: string;
}

interface ProjectStatusUpdateContext {
  api: DoorayApi;
  args: StatusUpdateArgs;
}

export async function runProjectStatusUpdate(context: ProjectStatusUpdateContext) {
  const {
    api,
    args: { class: statusClass, id, localeNames, name, order, projectId },
  } = context;

  await api.projectWorkflow.update({
    body: {
      class: statusClass,
      name,
      ...(localeNames && localeNames.length > 0 ? { names: localeNames } : {}),
      order,
    },
    path: { projectId, workflowId: id },
  });

  return { data: { id } };
}
