import type { DoorayApi } from '@dooray-sdk/client';

import { resolveTaskProjectId } from '../../utils/resolve-task-project-id';

export interface TaskCommentDeleteArgs {
  commentId: string;
  id: string;
  projectId?: string;
}

interface TaskCommentDeleteContext {
  api: DoorayApi;
  args: TaskCommentDeleteArgs;
}

export async function runTaskCommentDelete({ api, args }: TaskCommentDeleteContext) {
  const projectId = await resolveTaskProjectId(api, args);

  await api.projectTaskComment.delete({
    path: { commentId: args.commentId, projectId, taskId: args.id },
  });

  return {
    data: { id: args.commentId },
  };
}
