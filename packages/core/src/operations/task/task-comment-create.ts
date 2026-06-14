import type { DoorayApi } from '@dooray-sdk/client';

import type { BodyMimeType } from '../../constants/task';
import { DEFAULT_BODY_MIME_TYPE } from '../../constants/task';
import { resolveTaskProjectId } from '../../utils/resolve-task-project-id';

export interface TaskCommentCreateArgs {
  body: string;
  fileIds?: string[];
  id: string;
  mimeType?: BodyMimeType;
  projectId?: string;
}

interface TaskCommentCreateContext {
  api: DoorayApi;
  args: TaskCommentCreateArgs;
}

export async function runTaskCommentCreate({ api, args }: TaskCommentCreateContext) {
  const projectId = await resolveTaskProjectId(api, args);

  const res = await api.projectTaskComment.create({
    body: {
      attachFileIds: args.fileIds,
      body: { content: args.body, mimeType: args.mimeType ?? DEFAULT_BODY_MIME_TYPE },
    },
    path: { projectId, taskId: args.id },
  });

  return {
    data: { id: res.result.id },
  };
}
