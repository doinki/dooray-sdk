import type { MilestoneStatus } from '@dooray-sdk/client/project';

export type MilestoneState = MilestoneStatus;

export const MILESTONE_STATES = ['closed', 'open'] as const satisfies readonly MilestoneState[];
