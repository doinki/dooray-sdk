import { runTaskSetParent } from '@dooray-sdk/core';
import { z } from 'zod';

import { defineSubcommand } from '../../../shared/command/define-subcommand';
import { globalArgsSchema } from '../../../shared/command/global-args';
import { runWithTaskScope } from '../../../shared/command/run-with-task-scope';
import { renderKeyValue } from '../../../shared/formatter/output-formatter';

const schema = globalArgsSchema.extend({
  parentId: z
    .string()
    .min(1)
    .meta({ hint: 'parentId' })
    .describe('Parent task id, in the same project (from `dooray task list`).'),
});

export default defineSubcommand({
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
  schema,
});

function renderPretty({ data }: Awaited<ReturnType<typeof runTaskSetParent>>): string {
  return renderKeyValue([
    ['taskId', data.post.id],
    ['projectId', data.project.id],
  ]);
}
