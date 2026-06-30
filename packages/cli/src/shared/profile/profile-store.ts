import type { EnvironmentId } from '@dooray-sdk/core/constants';
import { findEnvironmentById } from '@dooray-sdk/core/constants';
import Conf from 'conf';

export const DEFAULT_PROFILE_NAME = 'default';

export interface ProfileRecord {
  baseUrl: string;
  environmentId: EnvironmentId;
  memberId?: string;
  memberName?: string;
  name: string;
  userCode?: string;
}

interface StoredProfile extends ProfileRecord {
  token: string;
}

interface DoorayConfigStore {
  activeProfile: null | string;
  profiles: Record<string, StoredProfile>;
}

const DEFAULTS: DoorayConfigStore = {
  activeProfile: null,
  profiles: {},
};

interface ProfileStoreOptions {
  cwd?: string;
}

/**
 * Profile persistence: credentials plus the active-profile pointer, read and
 * written through a single `conf`-backed file.
 *
 * A class is the right shape here — this is a cohesive repository over a
 * persistent resource (`#conf`) with a real method surface, not a thin stateless
 * helper. `UnknownProfileError` below is also a class, but for a different
 * reason: callers discriminate it with `instanceof`.
 */
export class ProfileStore {
  readonly #conf: Conf<DoorayConfigStore>;

  public constructor(options: ProfileStoreOptions = {}) {
    this.#conf = new Conf<DoorayConfigStore>({
      accessPropertiesByDotNotation: false,
      clearInvalidConfig: false,
      configFileMode: 0o600,
      configName: 'dooray',
      cwd: options.cwd,
      defaults: DEFAULTS,
      projectName: 'dooray',
      projectSuffix: '',
    });
  }

  public get filePath(): string {
    return this.#conf.path;
  }

  public getActiveProfile(): ProfileRecord | undefined {
    return stripToken(this.#activeStored());
  }

  public getActiveProfileName(): string | undefined {
    return this.#conf.get('activeProfile') ?? undefined;
  }

  public getActiveToken(): string | undefined {
    return this.#activeStored()?.token;
  }

  public getProfile(name: string): ProfileRecord | undefined {
    return stripToken(this.#profiles()[name]);
  }

  public getToken(name: string): string | undefined {
    return this.#profiles()[name]?.token;
  }

  public hasProfile(name: string): boolean {
    return Object.hasOwn(this.#profiles(), name);
  }

  public listProfiles(): ProfileRecord[] {
    return Object.values(this.#profiles())
      .map(stripTokenRequired)
      .toSorted((a, b) => a.name.localeCompare(b.name));
  }

  public logoutActive(): void {
    const active = this.#conf.get('activeProfile');
    if (active) this.#deleteProfile(active);
  }

  public removeProfile(name: string): void {
    if (!this.hasProfile(name)) throw new UnknownProfileError(name);
    this.#deleteProfile(name);
  }

  public saveProfile(profile: ProfileRecord, token: string): void {
    if (!findEnvironmentById(profile.environmentId)) throw new Error(`unknown environment: ${profile.environmentId}`);

    this.#conf.set({
      activeProfile: profile.name,
      profiles: { ...this.#profiles(), [profile.name]: { ...profile, token } },
    });
  }

  public setActive(name: string): void {
    if (!this.hasProfile(name)) throw new UnknownProfileError(name);
    this.#conf.set('activeProfile', name);
  }

  #activeStored(): StoredProfile | undefined {
    const active = this.#conf.get('activeProfile');
    return active ? this.#profiles()[active] : undefined;
  }

  /** Delete a profile by name and clear the active pointer if it was the one removed. */
  #deleteProfile(name: string): void {
    const next = { ...this.#profiles() };
    delete next[name];
    this.#conf.set('profiles', next);
    if (this.#conf.get('activeProfile') === name) this.#conf.set('activeProfile', null);
  }

  #profiles(): Record<string, StoredProfile> {
    return this.#conf.get('profiles');
  }
}

export class UnknownProfileError extends Error {
  public readonly profileName: string;

  public constructor(name: string) {
    super(`unknown profile: ${name}`);
    this.name = 'UnknownProfileError';
    this.profileName = name;
  }
}

function stripToken(stored: StoredProfile | undefined): ProfileRecord | undefined {
  return stored ? stripTokenRequired(stored) : undefined;
}

function stripTokenRequired(stored: StoredProfile): ProfileRecord {
  const { token: _token, ...profile } = stored;
  return profile;
}
