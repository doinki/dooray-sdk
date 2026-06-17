import { unknownProfileError } from '../../../shared/error/profile-errors';
import type { ProfileStore } from '../../../shared/profile/profile-store';
import { UnknownProfileError } from '../../../shared/profile/profile-store';

export function runProfileRemove(context: { name: string; profileStore: ProfileStore }) {
  try {
    context.profileStore.removeProfile(context.name);
  } catch (error: unknown) {
    if (error instanceof UnknownProfileError) throw unknownProfileError(error.profileName);
    throw error;
  }
}
