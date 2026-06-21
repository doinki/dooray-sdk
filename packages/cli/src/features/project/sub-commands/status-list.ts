import { runProjectStatusList } from '@dooray-sdk/core';
import { resolveProjectId } from '@dooray-sdk/core/resolve';

import { defineSubcommand } from '../../../shared/command/define-subcommand';
import { renderList } from '../../../shared/utils/table';

export default defineSubcommand({
  meta: {
    description: "List a project's task statuses with their class and order",
    name: 'status-list',
  },
  async run({ api, args, formatter }) {
    const projectId = await resolveProjectId({ api, ref: args.ref });
    const result = await runProjectStatusList({
      api,
      args: { projectId },
    });

    formatter.printData(result, renderPretty);
    if (result.data.length === 0) formatter.printInfo('No statuses.');
  },
});

function renderPretty({ data }: Awaited<ReturnType<typeof runProjectStatusList>>): null | string {
  if (data.length === 0) return null;

  return renderList(
    data.toSorted((a, b) => a.order - b.order),
    [
      { header: 'id', value: (w) => w.id },
      { header: 'name', value: (w) => w.name },
      { header: 'class', value: (w) => w.class },
      { header: 'order', value: (w) => w.order },
    ],
  );
}
