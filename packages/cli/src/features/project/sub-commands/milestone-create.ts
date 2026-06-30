import { runProjectMilestoneCreate } from '@dooray-sdk/core';
import { z } from 'zod';

import { defineSubcommand } from '../../../shared/command/define-subcommand';
import { globalArgsSchema } from '../../../shared/command/global-args';
import { runWithProjectScope } from '../../../shared/command/run-with-project-scope';
import { renderId } from '../../../shared/formatter/output-formatter';
import { optionalDate } from '../utils/fields';

const schema = globalArgsSchema
  .extend({
    endDate: optionalDate('End date with timezone offset (e.g. `2026-08-22+09:00`)'),
    name: z.string().trim().min(1).meta({ hint: 'text' }).describe('Milestone name (e.g. `1단계`)'),
    startDate: optionalDate('Start date with timezone offset (e.g. `2026-06-22+09:00`)'),
  })
  .refine((args) => (args.startDate === undefined) === (args.endDate === undefined), {
    message: 'Provide both --start-date and --end-date, or pass only --name.',
    path: ['startDate'],
  });

export default defineSubcommand({
  meta: { description: 'Create a milestone (dated phase; always starts open)', name: 'milestone-create' },
  async run({ api, args, formatter }) {
    const { data } = await runWithProjectScope({
      api,
      args,
      formatter,
      render: renderId,
      run: runProjectMilestoneCreate,
      schema,
    });

    formatter.printInfo(`Created milestone \`${data.name}\`.`);
  },
  schema,
});
