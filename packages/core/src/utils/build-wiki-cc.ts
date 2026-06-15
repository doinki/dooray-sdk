import type { DoorayApi } from '@dooray-sdk/client';
import type { WikiPageReferrer } from '@dooray-sdk/client/wiki';

import { createMemberIdResolver } from './resolve-member-id';

export async function buildWikiCc(api: DoorayApi, cc?: string[]): Promise<WikiPageReferrer[]> {
  if (!cc) return [];

  const resolveMemberId = createMemberIdResolver(api);
  const ids = await Promise.all(cc.map(resolveMemberId));

  return ids.map((organizationMemberId) => ({ member: { organizationMemberId }, type: 'member' }));
}
