import { runTaskSetParent } from '@dooray-sdk/core';
import { z } from 'zod';

import { defineSubcommand } from '../../../shared/command/define-subcommand';
import { runWithTaskScope } from '../../../shared/command/run-with-task-scope';
import { renderKeyValue } from '../../../shared/formatter/output-formatter';
import { argsFromSchema } from '../../../shared/utils/derive-args';
import { requireTaskRef, taskRefShape } from '../../../shared/utils/fields';

const schema = requireTaskRef(
  z.object({
    ...taskRefShape,
    parentId: z
      .string()
      .min(1)
      .meta({ hint: 'parentId' })
      .describe('Parent task id, in the same project (from `dooray task list`)'),
  }),
);

export default defineSubcommand({
  args: argsFromSchema(schema),
  globalArgs: ['json', 'profile', 'verbose'],
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
  return renderKeyValue([['ID', data.post.id]]);
}
