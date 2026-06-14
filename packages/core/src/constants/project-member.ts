import type { ProjectMemberAssignableRole } from '@dooray-sdk/client/project';

export const ASSIGNABLE_ROLES = ['admin', 'member'] as const satisfies readonly ProjectMemberAssignableRole[];
