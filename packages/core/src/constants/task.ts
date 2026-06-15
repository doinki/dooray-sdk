import type { TaskPriority } from '@dooray-sdk/client/project';

type SortBase<T extends string> = T extends `-${infer B}` ? B : T;

export const TASK_PRIORITIES = [
  'highest',
  'high',
  'normal',
  'low',
  'lowest',
  'none',
] as const satisfies readonly TaskPriority[];

export const BODY_MIME_TYPES = ['text/x-markdown', 'text/html'] as const;

export type BodyMimeType = (typeof BODY_MIME_TYPES)[number];

export const DEFAULT_BODY_MIME_TYPE = 'text/x-markdown' satisfies BodyMimeType;

export const COMMENT_SORTS = ['created', '-created'] as const;

export const COMMENT_SORT_FIELDS = {
  created: 'createdAt',
} as const satisfies Record<SortBase<(typeof COMMENT_SORTS)[number]>, string>;

export const SORT_OPTIONS = ['due', '-due', 'updated', '-updated', 'created', '-created'] as const;

export const TASK_SORT_FIELDS = {
  created: 'createdAt',
  due: 'postDueAt',
  updated: 'postUpdatedAt',
} as const satisfies Record<SortBase<(typeof SORT_OPTIONS)[number]>, string>;
