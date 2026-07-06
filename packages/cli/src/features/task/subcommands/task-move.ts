import type { TaskMoveArgs } from '@dooray-sdk/core';
import { runTaskMove } from '@dooray-sdk/core';
import { z } from 'zod';

import { confirmField } from '../../../shared/command/confirm-deletion';
import { defineSubcommand } from '../../../shared/command/define-subcommand';
import { globalArgsSchema } from '../../../shared/command/global-args';
import { runWithTaskScope } from '../../../shared/command/run-with-task-scope';
import { renderKeyValue } from '../../../shared/formatter/output-formatter';
import type { CommandSchemaShape } from '../../../shared/schemas/derive-args';
import { yesSchema } from '../../../shared/schemas/fields';

const schema = globalArgsSchema.extend({
  includeSubTasks: z.boolean().optional().describe("Move the task's subtasks along with it (default: true)."),
  targetProjectId: z
    .string()
    .min(1)
    .meta({ hint: 'projectId' })
    .describe('Destination project id (from `dooray project list`).'),
  yes: yesSchema,
} satisfies CommandSchemaShape<TaskMoveArgs>);

export default defineSubcommand({
  meta: {
    description: "Move a task to another project (clears the task's status and tags; irreversible)",
    name: 'move',
  },
  async run({ api, args, formatter }) {
    const { result } = await runWithTaskScope({
      api,
      args,
      confirm: confirmField(
        ({ args, id }) =>
          `Move task \`${id}\` to project \`${args.targetProjectId}\`? This clears its status and tags.`,
      ),
      formatter,
      render: renderPretty,
      run: runTaskMove,
      schema,
    });

    formatter.printInfo(`Moved task \`${result.data.post.id}\` to project \`${result.data.project.id}\`.`);
  },
  schema,
});

function renderPretty({ data }: Awaited<ReturnType<typeof runTaskMove>>): string {
  return renderKeyValue([
    ['id', data.post.id],
    ['projectId', data.project.id],
  ]);
}
