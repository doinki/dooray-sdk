import type { Workflow, WorkflowClass, WorkflowLocale, WorkflowLocaleName } from '@dooray-sdk/client/project';

export type Status = Workflow;
export type StatusClass = WorkflowClass;
export type StatusLocale = WorkflowLocale;
export type StatusLocaleName = WorkflowLocaleName;

export const STATUS_CLASSES = ['backlog', 'closed', 'registered', 'working'] as const satisfies readonly StatusClass[];

export const STATUS_LOCALES = ['en_US', 'ja_JP', 'ko_KR', 'zh_CN'] as const satisfies readonly StatusLocale[];
