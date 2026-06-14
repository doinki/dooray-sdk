import type { TaskUserInput } from '@dooray-sdk/client/project';

export function toMemberRef(organizationMemberId: string): TaskUserInput {
  return { member: { organizationMemberId }, type: 'member' };
}

export function toEmailUserRef(emailUser: { emailAddress: string; name: string }): TaskUserInput {
  return { emailUser: { emailAddress: emailUser.emailAddress, name: emailUser.name }, type: 'emailUser' };
}
