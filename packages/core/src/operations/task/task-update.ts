import type { DoorayApi } from '@dooray-sdk/client';
import type { Task, TaskPriority, TaskUpdateBody, TaskUserInput } from '@dooray-sdk/client/project';

import type { BodyMimeType } from '../../constants/task';
import { createMemberIdResolver } from '../../utils/resolve-member-id';
import { toEmailUserRef, toMemberRef } from '../../utils/task-user-ref';

export interface TaskUpdateArgs {
  assignees?: string[];
  body?: string;
  cc?: string[];
  dueDate?: null | string;
  dueDateFlag?: boolean;
  id: string;
  milestoneId?: string;
  mimeType?: BodyMimeType;
  priority?: TaskPriority;
  projectId?: string;
  tagIds?: string[];
  title?: string;
  version?: null | number;
}

interface TaskUpdateContext {
  api: DoorayApi;
  args: TaskUpdateArgs;
}

type Recipients = Task['users']['to'];

export async function runTaskUpdate({ api, args }: TaskUpdateContext) {
  const { result: task } = await api.projectTask.getById({ path: { taskId: args.id } });
  const projectId = args.projectId ?? task.project.id;
  const body = await buildUpdateBody(api, args, task);

  await api.projectTask.update({ body, path: { projectId, taskId: args.id } });

  return { data: { id: args.id } };
}

async function buildUpdateBody(api: DoorayApi, args: TaskUpdateArgs, task: Task): Promise<TaskUpdateBody> {
  const resolveMemberId = createMemberIdResolver(api);
  const [to, cc] = await Promise.all([
    resolveRecipients(args.assignees, task.users.to, resolveMemberId),
    resolveRecipients(args.cc, task.users.cc, resolveMemberId),
  ]);

  return {
    body: { content: args.body ?? task.body.content, mimeType: args.mimeType ?? task.body.mimeType },
    dueDate: args.dueDate === undefined ? task.dueDate : args.dueDate,
    dueDateFlag: args.dueDateFlag ?? task.dueDateFlag,
    milestoneId: args.milestoneId ?? task.milestone?.id,
    priority: args.priority ?? task.priority,
    subject: args.title ?? task.subject,
    tagIds: args.tagIds ?? task.tags.map((tag) => tag.id),
    users: { cc, to },
    version: args.version ?? null,
  };
}

async function resolveRecipients(
  values: string[] | undefined,
  current: Recipients,
  resolveMemberId: (value: string) => Promise<string>,
): Promise<TaskUserInput[]> {
  if (!values) return keepRecipients(current);

  const ids = await Promise.all(values.map(resolveMemberId));

  return ids.map(toMemberRef);
}

function keepRecipients(recipients: Recipients): TaskUserInput[] {
  return recipients.flatMap((recipient): TaskUserInput[] => {
    if (recipient.type === 'group')
      return recipient.group.members.map((member) => toMemberRef(member.organizationMemberId));
    if (recipient.type === 'emailUser') return [toEmailUserRef(recipient.emailUser)];
    return [toMemberRef(recipient.member.organizationMemberId)];
  });
}
