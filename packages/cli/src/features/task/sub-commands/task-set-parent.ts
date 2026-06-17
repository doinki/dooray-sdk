import { runTaskSetParent } from '@dooray-sdk/core';
import { z } from 'zod';

import { defineSubcommand } from '../../../shared/command/define-subcommand';
import { globalArgs } from '../../../shared/command/global-args';
import { runWithTaskScope } from '../../../shared/command/run-with-task-scope';
import { renderKeyValue } from '../../../shared/formatter/output-formatter';

export const taskSetParentArgsSchema = z
  .object({
    id: z
      .string()
      .optional()
      .describe('Task ID (19-digit). Looked up across all accessible projects when given alone.'),
    parentId: z.string().min(1).describe('Parent task id, in the same project (from `dooray task list`)'),
    ref: z
      .string()
      .optional()
      .describe('Task to target instead of <taskId>: a 19-digit task ID, `<projectId>/<id>`, or a Dooray task URL.'),
  })
  .refine((args) => args.id !== undefined || args.ref !== undefined, {
    message: 'Provide the task: pass <taskId> or --ref (task ID, `<projectId>/<id>`, or a Dooray task URL).',
    path: ['id'],
  });

export default defineSubcommand({
  args: {
    id: {
      description: taskSetParentArgsSchema.shape.id.description,
      required: false,
      type: 'positional',
      valueHint: 'taskId',
    },
    'parent-id': {
      description: taskSetParentArgsSchema.shape.parentId.description,
      required: true,
      type: 'string',
      valueHint: 'parentId',
    },
    ref: { ...globalArgs.ref, description: taskSetParentArgsSchema.shape.ref.description, required: false },
  },
  globalArgs: ['json', 'profile', 'verbose'],
  meta: { description: 'Re-parent a task as a subtask of another task in the same project', name: 'set-parent' },
  async run({ api, args, formatter }) {
    const { result } = await runWithTaskScope({
      api,
      args,
      formatter,
      render: renderPretty,
      run: runTaskSetParent,
      schema: taskSetParentArgsSchema,
    });

    formatter.printInfo(`Re-parented task \`${result.data.post.id}\`.`);
  },
});

function renderPretty({ data }: Awaited<ReturnType<typeof runTaskSetParent>>): string {
  return renderKeyValue([['ID', data.post.id]]);
}
