import { runTaskSetParent } from '@dooray-sdk/core';
import { z } from 'zod';

import { defineSubcommand } from '../../../shared/command/define-subcommand';
import { runWithTaskScope } from '../../../shared/command/run-with-task-scope';
import { renderKeyValue } from '../../../shared/formatter/output-formatter';
import { argsFromSchema } from '../../../shared/schemas/derive-args';

const schema = z.object({
  parentId: z
    .string()
    .min(1)
    .meta({ hint: 'parentId' })
    .describe('Parent task id, in the same project (from `dooray task list`)'),
});

export default defineSubcommand({
  args: argsFromSchema(schema),
  meta: { description: 'Re-parent a task as a subtask of another task in the same project', name: 'set-parent' },
  async run({ api, args, formatter }) {
    const { result } = await runWithTaskScope({
      api,
      args,
      formatter,
      render: renderPretty,
      run: runTaskSetParent,
      schema,
    });

    formatter.printInfo(`Re-parented task \`${result.data.post.id}\`.`);
  },
});

function renderPretty({ data }: Awaited<ReturnType<typeof runTaskSetParent>>): string {
  return renderKeyValue([['id', data.post.id]]);
}
