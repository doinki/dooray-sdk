/**
 * Structural view over the SDK's task/template user unions (`member` / `emailUser` / `group`).
 * Kept loose on purpose so every response variant is assignable without casts.
 */
interface MemberRef {
  name: string;
  organizationMemberId?: string;
}

export type UserLike =
  | { emailUser: { emailAddress: string; name?: null | string }; type: 'emailUser' }
  | { group: { code?: string; members?: readonly MemberRef[] }; type: 'group' }
  | { member: MemberRef; type: 'member' };

export interface FormatUserOptions {
  /** Append the stable identifier — `name(organizationMemberId)` / `name(emailAddress)`. */
  withId?: boolean;
}

/** Single display rule for task/template users: member name, email name (address fallback), group code (member expansion fallback). */
export function formatUser(user: UserLike, options: FormatUserOptions = {}): string {
  if (user.type === 'group')
    return user.group.code ?? (user.group.members ?? []).map((member) => formatMember(member, options)).join(', ');
  if (user.type === 'member') return formatMember(user.member, options);

  const { emailAddress, name } = user.emailUser;
  const display = name ?? emailAddress;
  return options.withId ? `${display}(${emailAddress})` : display;
}

function formatMember(member: MemberRef, options: FormatUserOptions): string {
  return options.withId && member.organizationMemberId ? `${member.name}(${member.organizationMemberId})` : member.name;
}
