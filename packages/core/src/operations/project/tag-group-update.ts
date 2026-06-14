import type { DoorayApi } from '@dooray-sdk/client';

export interface TagGroupUpdateArgs {
  id: string;
  projectId: string;
  required?: boolean;
  singleSelect?: boolean;
}

interface ProjectTagGroupUpdateContext {
  api: DoorayApi;
  args: TagGroupUpdateArgs;
}

export async function runProjectTagGroupUpdate(context: ProjectTagGroupUpdateContext) {
  const {
    api,
    args: { id, projectId, required, singleSelect },
  } = context;

  await api.projectTag.updateTagGroup({
    body: { mandatory: required, selectOne: singleSelect },
    path: { projectId, tagGroupId: id },
  });

  return { data: { id } };
}
