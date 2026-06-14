import type { DoorayApi } from '@dooray-sdk/client';

export interface MemberSearchArgs {
  email?: string[];
  exactUserCode?: string;
  name?: string;
  page?: number;
  size?: number;
  ssoId?: string;
  userCode?: string;
}

interface MemberSearchContext {
  api: DoorayApi;
  args: MemberSearchArgs;
}

export async function runMemberSearch(context: MemberSearchContext) {
  const {
    api,
    args: { email, exactUserCode, name, page, size, ssoId, userCode },
  } = context;

  const { paging, result } = await api.member.search({
    params: {
      externalEmailAddresses: email,
      idProviderUserId: ssoId,
      name,
      page,
      size,
      userCode,
      userCodeExact: exactUserCode,
    },
  });

  return { data: result, paging };
}
