import { runProjectMilestoneUpdate } from '@dooray-sdk/core';
import { MILESTONE_STATES } from '@dooray-sdk/core/constants';
import { z } from 'zod';

import { defineSubcommand } from '../../../shared/command/define-subcommand';
import { runWithProjectScope } from '../../../shared/command/run-with-project-scope';
import { renderId } from '../../../shared/formatter/output-formatter';
import { argsFromSchema } from '../../../shared/schema/derive-args';

export const milestoneUpdateArgsSchema = z
  .object({
    endDate: z
      .string()
      .optional()
      .meta({ hint: 'YYYY-MM-DD±HH:MM' })
      .describe('New end date with timezone offset (e.g. `2026-08-22+09:00`)'),
    id: z.string().min(1).meta({ hint: 'milestoneId', positional: true }).describe('Milestone id'),
    name: z
      .string()
      .trim()
      .min(1, 'Milestone name must not be empty.')
      .meta({ hint: 'text' })
      .describe('New milestone name'),
    startDate: z
      .string()
      .optional()
      .meta({ hint: 'YYYY-MM-DD±HH:MM' })
      .describe('New start date with timezone offset (e.g. `2026-07-22+09:00`)'),
    state: z.enum(MILESTONE_STATES).describe('open/closed lifecycle; closed milestones are still listed'),
  })
  .refine(
    (args) => (args.startDate === undefined) === (args.endDate === undefined),
    'Provide both --start-date and --end-date, or neither.',
  );

export default defineSubcommand({
  args: argsFromSchema(milestoneUpdateArgsSchema),
  meta: {
    description: 'Update a milestone (supplied fields only; state toggles open/close)',
    name: 'milestone-update',
  },
  async run({ api, args, formatter }) {
    await runWithProjectScope({
      api,
      args,
      formatter,
      render: renderId,
      run: runProjectMilestoneUpdate,
      schema: milestoneUpdateArgsSchema,
    });
  },
});
