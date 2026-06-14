import type { DoorayApi } from '@dooray-sdk/client';

import type { StatusClass, StatusLocaleName } from '../../constants/status';

export interface StatusCreateArgs {
  class: StatusClass;
  localeNames?: StatusLocaleName[];
  name: string;
  order?: number;
  projectId: string;
}

interface ProjectStatusCreateContext {
  api: DoorayApi;
  args: StatusCreateArgs;
}

export async function runProjectStatusCreate(context: ProjectStatusCreateContext) {
  const {
    api,
    args: { class: statusClass, localeNames, name, order, projectId },
  } = context;

  await api.projectWorkflow.create({
    body: {
      class: statusClass,
      name,
      order,
      ...(localeNames && localeNames.length > 0 ? { names: localeNames } : {}),
    },
    path: { projectId },
  });

  return { data: context.args };
}
