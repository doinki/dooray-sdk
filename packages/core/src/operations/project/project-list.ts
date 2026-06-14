import type { DoorayApi } from '@dooray-sdk/client';
import type { ProjectScope, ProjectState, ProjectType } from '@dooray-sdk/client/project';

export interface ProjectListArgs {
  member?: string;
  page?: number;
  scope?: ProjectScope;
  size?: number;
  state?: ProjectState;
  type?: ProjectType;
}

interface ProjectListContext {
  api: DoorayApi;
  args: ProjectListArgs;
}

export async function runProjectList(context: ProjectListContext) {
  const {
    api,
    args: { member, page, scope, size, state, type },
  } = context;

  const { paging, result } = await api.project.list({
    params: {
      member,
      page,
      scope,
      size,
      state,
      type,
    },
  });

  return { data: result, paging };
}
