import type { DoorayApi } from '@dooray-sdk/client';

import { resolveTaskProjectId } from '../../utils/resolve-task-project-id';

export interface TaskCommentViewArgs {
  commentId: string;
  id: string;
  projectId?: string;
}

interface TaskCommentViewContext {
  api: DoorayApi;
  args: TaskCommentViewArgs;
}

export async function runTaskCommentView({ api, args }: TaskCommentViewContext) {
  const projectId = await resolveTaskProjectId(api, args);

  const res = await api.projectTaskComment.get({
    path: { commentId: args.commentId, projectId, taskId: args.id },
  });

  return {
    data: res.result,
  };
}
