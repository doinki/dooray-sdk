import type { DoorayApi } from '@dooray-sdk/client';
import type { DoorayEnvironment } from '@dooray-sdk/core/constants';

import type { ProfileStore } from '../../../shared/profile/profile-store';

interface RunAuthLoginArgs {
  env: DoorayEnvironment;
  name: string;
  token: string;
}

interface RunAuthLoginContext {
  api: DoorayApi;
  args: RunAuthLoginArgs;
  profileStore: ProfileStore;
}

export async function runAuthLogin(context: RunAuthLoginContext) {
  const {
    api,
    args: { env, name, token },
    profileStore,
  } = context;

  const { result } = await api.member.getMe();

  const data = {
    baseUrl: env.baseUrl,
    environmentId: env.id,
    memberId: result.id,
    memberName: result.name,
    name,
    userCode: result.userCode,
  };

  profileStore.saveProfile(data, token);

  return data;
}
