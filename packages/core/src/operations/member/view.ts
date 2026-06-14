import type { DoorayApi } from '@dooray-sdk/client';
import type { Member } from '@dooray-sdk/client/common';

export interface MemberViewArgs {
  id: string;
}

interface MemberViewContext {
  api: DoorayApi;
  args: MemberViewArgs;
}

export async function runMemberView(context: MemberViewContext): Promise<{ data: Member }> {
  const {
    api,
    args: { id },
  } = context;

  const { result } = await api.member.get({ path: { memberId: id } });

  return { data: result };
}
