import { runTaskMove } from '@dooray-sdk/core';
import { z } from 'zod';

import { defineSubcommand } from '../../../shared/command/define-subcommand';
import { globalArgs } from '../../../shared/command/global-args';
import { runWithTaskScope } from '../../../shared/command/run-with-task-scope';
import { renderKeyValue } from '../../../shared/formatter/output-formatter';

export const taskMoveArgsSchema = z
  .object({
    id: z
      .string()
      .optional()
      .describe('Task ID (19-digit). Looked up across all accessible projects when given alone.'),
    includeSubTasks: z.boolean().optional().describe("Move the task's subtasks along with it (default: true)"),
    ref: z
      .string()
      .optional()
      .describe('Task to target instead of <taskId>: a 19-digit task ID, `<projectId>/<id>`, or a Dooray task URL.'),
    targetProjectId: z.string().min(1).describe('Destination project id (from `dooray project list`)'),
  })
  .refine((args) => args.id !== undefined || args.ref !== undefined, {
    message: 'Provide the task: pass <taskId> or --ref (task ID, `<projectId>/<id>`, or a Dooray task URL).',
    path: ['id'],
  });

export default defineSubcommand({
  args: {
    id: {
      description: taskMoveArgsSchema.shape.id.description,
      required: false,
      type: 'positional',
      valueHint: 'taskId',
    },
    'include-sub-tasks': {
      description: taskMoveArgsSchema.shape.includeSubTasks.description,
      type: 'boolean',
    },
    ref: { ...globalArgs.ref, description: taskMoveArgsSchema.shape.ref.description, required: false },
    'target-project-id': {
      description: taskMoveArgsSchema.shape.targetProjectId.description,
      required: true,
      type: 'string',
      valueHint: 'projectId',
    },
  },
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
