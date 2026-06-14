import type { DoorayApi } from '@dooray-sdk/client';
import type { Member } from '@dooray-sdk/client/common';

export async function runMemberMe(context: { api: DoorayApi }): Promise<{ data: Member }> {
  const { api } = context;

  const { result } = await api.member.getMe();

  return { data: result };
}
