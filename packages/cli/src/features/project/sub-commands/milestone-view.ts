import { runProjectMilestoneView } from '@dooray-sdk/core';
import { z } from 'zod';

import { defineSubcommand } from '../../../shared/command/define-subcommand';
import { runWithProjectScope } from '../../../shared/command/run-with-project-scope';
import { renderKeyValue } from '../../../shared/formatter/output-formatter';
import { argsFromSchema } from '../../../shared/schemas/derive-args';

const schema = z.object({
  id: z
    .string()
    .min(1)
    .meta({ hint: 'milestoneId', positional: true })
    .describe('Milestone id (from `milestone-list`)'),
});

export default defineSubcommand({
  args: argsFromSchema(schema),
  meta: { description: "Show a milestone's date range and state", name: 'milestone-view' },
  async run({ api, args, formatter }) {
    await runWithProjectScope({
      api,
      args,
      formatter,
      render: renderPretty,
      run: runProjectMilestoneView,
      schema,
    });
  },
});

function renderPretty({ data: m }: Awaited<ReturnType<typeof runProjectMilestoneView>>): string {
  return renderKeyValue([
    ['ID', m.id],
    ['Name', m.name],
    ['Status', m.status],
    ['Started At', m.startedAt],
    ['Ended At', m.endedAt],
    ['Closed At', m.closedAt],
    ['Created At', m.createdAt],
    ['Updated At', m.updatedAt],
  ]);
}
