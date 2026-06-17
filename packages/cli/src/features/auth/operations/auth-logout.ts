import type { ProfileStore } from '../../../shared/profile/profile-store';

export function runAuthLogout(context: { profileStore: ProfileStore }) {
  const { profileStore } = context;

  const profile = profileStore.getActiveProfile();
  if (!profile) return null;

  profileStore.logoutActive();

  return profile;
}
