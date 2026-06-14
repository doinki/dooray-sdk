import type { ProjectScope, ProjectState, ProjectType } from '@dooray-sdk/client/project';

export const PROJECT_SCOPES = ['private', 'public'] as const satisfies readonly ProjectScope[];

export const PROJECT_STATES = ['active', 'archived', 'deleted'] as const satisfies readonly ProjectState[];

export const PROJECT_TYPES = ['private', 'public'] as const satisfies readonly ProjectType[];
