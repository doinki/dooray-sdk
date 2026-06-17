import { runProjectMilestoneUpdate } from '@dooray-sdk/core';
import { MILESTONE_STATES } from '@dooray-sdk/core/constants';
import { z } from 'zod';

import { defineSubcommand } from '../../../shared/command/define-subcommand';
import { runWithProjectScope } from '../../../shared/command/run-with-project-scope';
import { renderKeyValue } from '../../../shared/formatter/output-formatter';

export const milestoneUpdateArgsSchema = z
  .object({
    endDate: z.string().optional().describe('New end date with timezone offset (e.g. `2026-08-22+09:00`)'),
    id: z.string().min(1).describe('Milestone id'),
    name: z.string().trim().min(1, 'Milestone name must not be empty.').describe('New milestone name'),
    startDate: z.string().optional().describe('New start date with timezone offset (e.g. `2026-07-22+09:00`)'),
    state: z.enum(MILESTONE_STATES).describe('open/closed lifecycle; closed milestones are still listed'),
  })
  .refine(
    (args) => (args.startDate === undefined) === (args.endDate === undefined),
    'Provide both --start-date and --end-date, or neither.',
  );

export default defineSubcommand({
  args: {
    'end-date': {
      description: milestoneUpdateArgsSchema.shape.endDate.description,
      type: 'string',
      valueHint: 'YYYY-MM-DD±HH:MM',
    },
    id: {
      description: milestoneUpdateArgsSchema.shape.id.description,
      required: true,
      type: 'positional',
      valueHint: 'milestoneId',
    },
    name: {
      description: milestoneUpdateArgsSchema.shape.name.description,
      required: true,
      type: 'string',
      valueHint: 'text',
    },
    'start-date': {
      description: milestoneUpdateArgsSchema.shape.startDate.description,
      type: 'string',
      valueHint: 'YYYY-MM-DD±HH:MM',
    },
    state: {
      description: milestoneUpdateArgsSchema.shape.state.description,
      options: [...MILESTONE_STATES],
      required: true,
      type: 'enum',
    },
  },
  meta: {
    description: 'Update a milestone (supplied fields only; state toggles open/close)',
    name: 'milestone-update',
  },
  async run({ api, args, formatter }) {
    await runWithProjectScope({
      api,
      args,
      formatter,
      render: renderPretty,
      run: runProjectMilestoneUpdate,
      schema: milestoneUpdateArgsSchema,
    });
  },
});

function renderPretty({ data }: Awaited<ReturnType<typeof runProjectMilestoneUpdate>>): string {
  return renderKeyValue([['ID', data.id]]);
}
