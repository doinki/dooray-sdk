import { runTaskMove } from '@dooray-sdk/core';
import { z } from 'zod';

import { defineSubcommand } from '../../../shared/command/define-subcommand';
import { runWithTaskScope } from '../../../shared/command/run-with-task-scope';
import { renderKeyValue } from '../../../shared/formatter/output-formatter';
import { argsFromSchema } from '../../../shared/schema/derive-args';
import { requireTaskRef, taskRefShape } from '../../../shared/schema/fields';

export const taskMoveArgsSchema = requireTaskRef(
  z.object({
    ...taskRefShape,
    includeSubTasks: z.boolean().optional().describe("Move the task's subtasks along with it (default: true)"),
    targetProjectId: z
      .string()
      .min(1)
      .meta({ hint: 'projectId' })
      .describe('Destination project id (from `dooray project list`)'),
  }),
);

export default defineSubcommand({
  args: argsFromSchema(taskMoveArgsSchema),
  globalArgs: ['json', 'profile', 'verbose'],
  meta: {
    description: "Move a task to another project (clears the task's status and tags; irreversible)",
    name: 'move',
  },
  async run({ api, args, formatter }) {
    const { result } = await runWithTaskScope({
      api,
      args,
      formatter,
      render: renderPretty,
      run: runTaskMove,
      schema: taskMoveArgsSchema,
    });

    formatter.printInfo(`Moved task \`${result.data.post.id}\` to project \`${result.data.project.id}\`.`);
  },
});

function renderPretty({ data }: Awaited<ReturnType<typeof runTaskMove>>): string {
  return renderKeyValue([
    ['Task ID', data.post.id],
    ['Project ID', data.project.id],
  ]);
}
