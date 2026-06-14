import type { DoorayApi } from '@dooray-sdk/client';

export function createMemberIdResolver(api: DoorayApi): (value: string) => Promise<string> {
  let mePromise: Promise<string> | undefined;
  return (value) => {
    if (value !== 'me' && value !== '@me') return Promise.resolve(value);
    mePromise ??= api.member.getMe().then(({ result }) => result.id);
    return mePromise;
  };
}
