import { findEnvironmentById } from '@dooray-sdk/core/constants';

import type { ProfileRecord, ProfileStore } from '../../../shared/profile/profile-store';

export function runProfileList(context: { profileStore: ProfileStore }) {
  const profiles = context.profileStore.listProfiles();
  const activeName = context.profileStore.getActiveProfileName();

  return serializeProfileList(profiles, activeName);
}

interface ProfileListItemOutput {
  active: boolean;
  baseUrl: string;
  environmentId: string;
  environmentLabel: string;
  memberName: null | string;
  name: string;
}

interface ProfileListOutput {
  activeProfile: null | string;
  profiles: ProfileListItemOutput[];
}

export function serializeProfileList(profiles: ProfileRecord[], activeName: string | undefined): ProfileListOutput {
  return {
    activeProfile: activeName ?? null,
    profiles: profiles.map((profile) => ({
      active: profile.name === activeName,
      baseUrl: profile.baseUrl,
      environmentId: profile.environmentId,
      environmentLabel: findEnvironmentById(profile.environmentId)?.label ?? profile.environmentId,
      memberName: profile.memberName ?? null,
      name: profile.name,
    })),
  };
}
