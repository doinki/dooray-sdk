import type { DoorayApi } from '@dooray-sdk/client';
import type { TaskPriority } from '@dooray-sdk/client/project';

import type { BodyMimeType } from '../../constants/task';
import { DEFAULT_BODY_MIME_TYPE } from '../../constants/task';
import { buildCreateUsers } from '../../utils/build-create-users';

export interface TaskDraftCreateArgs {
  assignees?: string[];
  body?: string;
  cc?: string[];
  dueDate?: string;
  dueDateFlag?: boolean;
  milestoneId?: string;
  mimeType?: BodyMimeType;
  priority?: TaskPriority;
  projectId: string;
  tagIds?: string[];
  title: string;
}

interface TaskDraftCreateContext {
  api: DoorayApi;
  args: TaskDraftCreateArgs;
}

export async function runTaskCreateDraft({ api, args }: TaskDraftCreateContext) {
  const users = await buildCreateUsers(api, args);

  const res = await api.projectTask.createDraft({
    body: {
      body: { content: args.body ?? '', mimeType: args.mimeType ?? DEFAULT_BODY_MIME_TYPE },
      dueDate: args.dueDate,
      dueDateFlag: args.dueDateFlag,
      milestoneId: args.milestoneId,
      priority: args.priority,
      projectId: args.projectId,
      subject: args.title,
      tagIds: args.tagIds,
      users,
    },
  });

  return { data: res.result };
}
