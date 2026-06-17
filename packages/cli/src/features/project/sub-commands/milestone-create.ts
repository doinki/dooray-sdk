import { runProjectMilestoneCreate } from '@dooray-sdk/core';
import { z } from 'zod';

import { defineSubcommand } from '../../../shared/command/define-subcommand';
import { runWithProjectScope } from '../../../shared/command/run-with-project-scope';
import { renderKeyValue } from '../../../shared/formatter/output-formatter';

const optionalDate = (describe: string) =>
  z
    .string()
    .trim()
    .optional()
    .transform((value) => value || undefined)
    .describe(describe);

export const milestoneCreateArgsSchema = z
  .object({
    endDate: optionalDate('End date with timezone offset (e.g. `2026-08-22+09:00`)'),
    name: z.string().trim().min(1, 'Milestone name must not be empty.').describe('Milestone name (e.g. `1단계`)'),
    startDate: optionalDate('Start date with timezone offset (e.g. `2026-06-22+09:00`)'),
  })
  .refine(
    (args) => (args.startDate === undefined) === (args.endDate === undefined),
    'Provide both --start-date and --end-date, or pass only --name.',
  );

export default defineSubcommand({
  args: {
    'end-date': {
      description: milestoneCreateArgsSchema.shape.endDate.description,
      type: 'string',
      valueHint: 'YYYY-MM-DD±HH:MM',
    },
    name: {
      description: milestoneCreateArgsSchema.shape.name.description,
      required: true,
      type: 'string',
      valueHint: 'text',
    },
    'start-date': {
      description: milestoneCreateArgsSchema.shape.startDate.description,
      type: 'string',
      valueHint: 'YYYY-MM-DD±HH:MM',
    },
  },
  meta: { description: 'Create a milestone (dated phase; always starts open)', name: 'milestone-create' },
  async run({ api, args, formatter }) {
    const { data } = await runWithProjectScope({
      api,
      args,
      formatter,
      render: renderPretty,
      run: runProjectMilestoneCreate,
      schema: milestoneCreateArgsSchema,
    });

    formatter.printInfo(`Created milestone \`${data.name}\`.`);
  },
});

function renderPretty({ data: result }: Awaited<ReturnType<typeof runProjectMilestoneCreate>>): string {
  return renderKeyValue([['ID', result.id]]);
}
