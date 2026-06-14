import type { DoorayApi } from '@dooray-sdk/client';
import type { TaskUserInput } from '@dooray-sdk/client/project';

import { createMemberIdResolver } from './resolve-member-id';
import { toMemberRef } from './task-user-ref';

export async function buildCreateUsers(
  api: DoorayApi,
  args: { assignees?: string[]; cc?: string[] },
): Promise<{ cc: TaskUserInput[] | undefined; to: TaskUserInput[] }> {
  const resolveMemberId = createMemberIdResolver(api);

  const to = await Promise.all((args.assignees?.length ? args.assignees : ['@me']).map(resolveMemberId));
  const cc = args.cc?.length ? await Promise.all(args.cc.map(resolveMemberId)) : undefined;

  return { cc: cc?.map(toMemberRef), to: to.map(toMemberRef) };
}
