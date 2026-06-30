import { runProjectMilestoneUpdate } from '@dooray-sdk/core';
import { MILESTONE_STATES } from '@dooray-sdk/core/constants';
import { z } from 'zod';

import { defineSubcommand } from '../../../shared/command/define-subcommand';
import { globalArgsSchema } from '../../../shared/command/global-args';
import { runWithProjectScope } from '../../../shared/command/run-with-project-scope';
import { renderId } from '../../../shared/formatter/output-formatter';
import { optionalDate } from '../utils/fields';

const schema = globalArgsSchema
  .extend({
    endDate: optionalDate('New end date with timezone offset (e.g. `2026-08-22+09:00`)'),
    id: z.string().min(1).meta({ hint: 'milestoneId', positional: true }).describe('Milestone id'),
    name: z.string().trim().min(1).optional().meta({ hint: 'text' }).describe('New milestone name'),
    startDate: optionalDate('New start date with timezone offset (e.g. `2026-07-22+09:00`)'),
    state: z.enum(MILESTONE_STATES).optional().describe('open/closed lifecycle; closed milestones are still listed'),
  })
  .superRefine((args, ctx) => {
    if ((args.startDate === undefined) !== (args.endDate === undefined)) {
      ctx.addIssue({
        code: 'custom',
        message: 'Provide both --start-date and --end-date, or neither.',
        path: ['startDate'],
      });
    }
    if (args.name === undefined && args.state === undefined && args.startDate === undefined) {
      ctx.addIssue({
        code: 'custom',
        message: 'Nothing to update — pass at least one of --name, --state, or --start-date/--end-date.',
        path: ['name'],
      });
    }
  });

export default defineSubcommand({
  meta: {
    description: 'Update a milestone (supplied fields only; state toggles open/close)',
    name: 'milestone-update',
  },
  async run({ api, args, formatter }) {
    const { data } = await runWithProjectScope({
      api,
      args,
      formatter,
      render: renderId,
      run: runProjectMilestoneUpdate,
      schema,
    });

    formatter.printInfo(`Updated milestone \`${data.id}\`.`);
  },
  schema,
});
