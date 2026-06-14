import type { DoorayApi } from '@dooray-sdk/client';
import type { TaskListParams as SdkTaskListParams } from '@dooray-sdk/client/project';

import type { STATUS_CLASSES } from '../../constants/status';
import type { SORT_OPTIONS } from '../../constants/task';
import { TASK_SORT_FIELDS } from '../../constants/task';
import { createMemberIdResolver } from '../../utils/resolve-member-id';
import { toOrder } from './sort-order';

export type StatusClassInput = (typeof STATUS_CLASSES)[number];

export type TaskListSort = (typeof SORT_OPTIONS)[number];

export interface TaskListArgs {
  assignee?: string[];
  author?: string[];
  authorEmail?: string;
  cc?: string[];
  created?: string;
  due?: string;
  milestone?: string[];
  number?: number;
  page?: number;
  parent?: string;
  projectId: string;
  search?: string[];
  size?: number;
  sort?: TaskListSort;
  status?: string[];
  statusClass?: StatusClassInput[];
  tagIds?: string[];
  updated?: string;
}

interface TaskListContext {
  api: DoorayApi;
  args: TaskListArgs;
}

export async function runTaskList(context: TaskListContext) {
  const {
    api,
    args: { page, projectId, size },
  } = context;

  const params = await buildTaskListArgs(context.args, api);
  const { paging, result } = await api.projectTask.list({
    params: { ...params, page, size },
    path: { projectId },
  });

  return { data: result, paging };
}

async function buildTaskListArgs(args: TaskListArgs, api: DoorayApi): Promise<SdkTaskListParams> {
  const {
    assignee,
    author,
    authorEmail,
    cc,
    created,
    due,
    milestone,
    number,
    parent,
    search,
    sort,
    status,
    statusClass,
    tagIds,
    updated,
  } = args;
  const resolveMemberId = createMemberIdResolver(api);

  const params: SdkTaskListParams = {
    createdAt: created,
    dueAt: due,
    fromEmailAddress: authorEmail,
    milestoneIds: milestone,
    order: toOrder(sort, TASK_SORT_FIELDS),
    parentPostId: parent,
    postNumber: number,
    postWorkflowClasses: statusClass,
    postWorkflowIds: status,
    subjects: search,
    tagIds,
    updatedAt: updated,
  };

  if (author?.length) params.fromMemberIds = await Promise.all(author.map(resolveMemberId));
  if (assignee?.length) {
    if (assignee.includes('none')) params.toMemberSize = 0;
    else params.toMemberIds = await Promise.all(assignee.map(resolveMemberId));
  }
  if (cc?.length) params.ccMemberIds = await Promise.all(cc.map(resolveMemberId));

  return params;
}
