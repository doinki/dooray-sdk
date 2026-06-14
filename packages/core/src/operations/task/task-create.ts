import type { DoorayApi } from '@dooray-sdk/client';
import type { TaskPriority } from '@dooray-sdk/client/project';

import type { BodyMimeType } from '../../constants/task';
import { DEFAULT_BODY_MIME_TYPE } from '../../constants/task';
import { buildCreateUsers } from '../../utils/build-create-users';

export interface TaskCreateArgs {
  assignees?: string[];
  body?: string;
  cc?: string[];
  dueDate?: string;
  dueDateFlag?: boolean;
  milestoneId?: string;
  mimeType?: BodyMimeType;
  parentId?: string;
  priority?: TaskPriority;
  projectId: string;
  tagIds?: string[];
  title: string;
}

interface TaskCreateContext {
  api: DoorayApi;
  args: TaskCreateArgs;
}

export async function runTaskCreate({ api, args }: TaskCreateContext) {
  const users = await buildCreateUsers(api, args);

  const res = await api.projectTask.create({
    body: {
      body: { content: args.body ?? '', mimeType: args.mimeType ?? DEFAULT_BODY_MIME_TYPE },
      dueDate: args.dueDate,
      dueDateFlag: args.dueDateFlag,
      milestoneId: args.milestoneId,
      parentPostId: args.parentId,
      priority: args.priority,
      subject: args.title,
      tagIds: args.tagIds,
      users,
    },
    path: { projectId: args.projectId },
  });

  return { data: { id: res.result.id } };
}
