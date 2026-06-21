import { runTaskMove } from '@dooray-sdk/core';
import { z } from 'zod';

import { confirmDeletion } from '../../../shared/command/confirm-deletion';
import { defineSubcommand } from '../../../shared/command/define-subcommand';
import { isJsonOutput } from '../../../shared/command/json-output';
import { runWithTaskScope } from '../../../shared/command/run-with-task-scope';
import { renderKeyValue } from '../../../shared/formatter/output-formatter';
import { argsFromSchema } from '../../../shared/utils/derive-args';
import { confirmField, requireTaskRef, taskRefShape } from '../../../shared/utils/fields';

export const taskMoveArgsSchema = requireTaskRef(
  z.object({
    ...taskRefShape,
    includeSubTasks: z.boolean().optional().describe("Move the task's subtasks along with it (default: true)"),
    targetProjectId: z
      .string()
      .min(1)
      .meta({ hint: 'projectId' })
      .describe('Destination project id (from `dooray project list`)'),
    yes: confirmField,
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
      confirm: ({ args: a, id }) =>
        confirmDeletion({
          json: isJsonOutput(args.json),
          message: `Move task \`${id}\` to project \`${a.targetProjectId}\`? This clears its status and tags.`,
          skip: a.yes,
        }),
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
