import type { DoorayApi } from '@dooray-sdk/client';

import type { BodyMimeType } from '../../constants/task';
import { DEFAULT_BODY_MIME_TYPE } from '../../constants/task';
import { resolveTaskProjectId } from '../../utils/resolve-task-project-id';

export interface TaskCommentUpdateArgs {
  body: string;
  commentId: string;
  fileIds?: string[];
  id: string;
  mimeType?: BodyMimeType;
  projectId?: string;
}

interface TaskCommentUpdateContext {
  api: DoorayApi;
  args: TaskCommentUpdateArgs;
}

export async function runTaskCommentUpdate({ api, args }: TaskCommentUpdateContext) {
  const projectId = await resolveTaskProjectId(api, args);

  await api.projectTaskComment.update({
    body: {
      attachFileIds: args.fileIds,
      body: { content: args.body, mimeType: args.mimeType ?? DEFAULT_BODY_MIME_TYPE },
    },
    path: { commentId: args.commentId, projectId, taskId: args.id },
  });

  return {
    data: { id: args.commentId },
  };
}
