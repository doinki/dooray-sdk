import { noActiveProfileError, unknownProfileError } from '../error/profile-errors';
import type { ProfileRecord, ProfileStore } from './profile-store';

export interface ResolvedProfile {
  profile: ProfileRecord;
  token: string;
}

export function resolveProfile(store: ProfileStore, override?: string): ResolvedProfile {
  const trimmed = override?.trim();
  if (trimmed) {
    const profile = store.getProfile(trimmed);
    const token = store.getToken(trimmed);
    if (!profile || !token) throw unknownProfileError(trimmed);
    return { profile, token };
  }
  const profile = store.getActiveProfile();
  const token = store.getActiveToken();
  if (!profile || !token) throw noActiveProfileError();
  return { profile, token };
}
