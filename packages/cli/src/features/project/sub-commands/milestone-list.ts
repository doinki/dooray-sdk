import { runProjectMilestoneList } from '@dooray-sdk/core';
import { MILESTONE_STATES } from '@dooray-sdk/core/constants';
import { pageSchema, sizeSchema } from '@dooray-sdk/core/schemas';
import { z } from 'zod';

import { defineSubcommand } from '../../../shared/command/define-subcommand';
import { runWithProjectScope } from '../../../shared/command/run-with-project-scope';
import { renderPagingFooter } from '../../../shared/formatter/output-formatter';
import { argsFromSchema } from '../../../shared/schemas/derive-args';
import { renderList } from '../../../shared/utils/table';
import { formatDate } from '../../../shared/utils/text';

const schema = z.object({
  page: pageSchema,
  size: sizeSchema,
  state: z
    .enum(MILESTONE_STATES)
    .optional()
    .describe('Filter by state — `open` (active) or `closed` (finished). Omit to include both'),
});

export default defineSubcommand({
  args: argsFromSchema(schema),
  meta: { description: 'List milestones in a project (filter by state; paginated)', name: 'milestone-list' },
  async run({ api, args, formatter }) {
    const { result } = await runWithProjectScope({
      api,
      args,
      formatter,
      render: renderPretty,
      run: runProjectMilestoneList,
      schema,
    });

    formatter.printInfo(result.data.length === 0 ? 'No milestones.' : renderPagingFooter(result.paging));
  },
});

function renderPretty({ data }: Awaited<ReturnType<typeof runProjectMilestoneList>>): null | string {
  if (data.length === 0) return null;

  return renderList(data, [
    { header: 'id', value: (m) => m.id },
    { header: 'name', value: (m) => m.name },
    { header: 'state', value: (m) => m.status },
    { header: 'started', value: (m) => formatDate(m.startedAt) },
    { header: 'ended', value: (m) => formatDate(m.endedAt) },
  ]);
}
