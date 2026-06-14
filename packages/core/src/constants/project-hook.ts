import type { ProjectHookCreateBody, ProjectHookEvent } from '@dooray-sdk/client/project';

export const PROJECT_EVENTS = [
  'codeChanged',
  'memberChanged',
  'stateChanged',
] as const satisfies readonly ProjectHookEvent[];

export const TASK_EVENTS = [
  'postBodyChanged',
  'postCommentCreated',
  'postCommentUpdated',
  'postCreated',
  'postDueDateChanged',
  'postMilestoneChanged',
  'postMoved',
  'postParentChanged',
  'postSubjectChanged',
  'postTagChanged',
  'postUserChanged',
  'postWorkflowChanged',
] as const satisfies readonly ProjectHookEvent[];

export const PROJECT_HOOK_EVENTS = [...TASK_EVENTS, ...PROJECT_EVENTS] as const satisfies readonly ProjectHookEvent[];

export const PROJECT_HOOK_TYPES = ['project', 'task'] as const satisfies ReadonlyArray<
  NonNullable<ProjectHookCreateBody['type']>
>;
