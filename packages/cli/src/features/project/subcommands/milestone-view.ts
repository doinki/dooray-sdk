import { runProjectMilestoneView } from '@dooray-sdk/core';
import { z } from 'zod';

import { defineSubcommand } from '../../../shared/command/define-subcommand';
import { globalArgsSchema } from '../../../shared/command/global-args';
import { runWithProjectScope } from '../../../shared/command/run-with-project-scope';
import { renderKeyValue } from '../../../shared/formatter/output-formatter';

const schema = globalArgsSchema.extend({
  id: z
    .string()
    .min(1)
    .meta({ hint: 'milestoneId', positional: true })
    .describe('Milestone id (from `milestone-list`)'),
});

export default defineSubcommand({
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
  schema,
});

function renderPretty({ data: m }: Awaited<ReturnType<typeof runProjectMilestoneView>>): string {
  return renderKeyValue([
    ['id', m.id],
    ['name', m.name],
    ['status', m.status],
    ['startedAt', m.startedAt],
    ['endedAt', m.endedAt],
    ['closedAt', m.closedAt],
    ['createdAt', m.createdAt],
    ['updatedAt', m.updatedAt],
  ]);
}
