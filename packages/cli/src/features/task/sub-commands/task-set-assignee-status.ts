import { runTaskSetAssigneeStatus } from '@dooray-sdk/core';
import { z } from 'zod';

import { defineSubcommand } from '../../../shared/command/define-subcommand';
import { globalArgs } from '../../../shared/command/global-args';
import { runWithTaskScope } from '../../../shared/command/run-with-task-scope';
import { renderKeyValue } from '../../../shared/formatter/output-formatter';

export const taskSetAssigneeStatusArgsSchema = z
  .object({
    id: z
      .string()
      .optional()
      .describe('Task ID (19-digit). Looked up across all accessible projects when given alone.'),
    memberId: z.string().min(1).describe('Assignee member id or `@me` (from `dooray member search`)'),
    ref: z
      .string()
      .optional()
      .describe('Task to target instead of <taskId>: a 19-digit task ID, `<projectId>/<id>`, or a Dooray task URL.'),
    statusId: z.string().min(1).describe('Status id to set for this assignee (from `dooray project status-list`)'),
  })
  .refine((args) => args.id !== undefined || args.ref !== undefined, {
    message: 'Provide the task: pass <taskId> or --ref (task ID, `<projectId>/<id>`, or a Dooray task URL).',
    path: ['id'],
  });

export default defineSubcommand({
  args: {
    id: {
      description: taskSetAssigneeStatusArgsSchema.shape.id.description,
      required: false,
      type: 'positional',
      valueHint: 'taskId',
    },
    'member-id': {
      description: taskSetAssigneeStatusArgsSchema.shape.memberId.description,
      required: true,
      type: 'string',
      valueHint: 'memberId',
    },
    ref: { ...globalArgs.ref, description: taskSetAssigneeStatusArgsSchema.shape.ref.description, required: false },
    'status-id': {
      description: taskSetAssigneeStatusArgsSchema.shape.statusId.description,
      required: true,
      type: 'string',
      valueHint: 'statusId',
    },
  },
  globalArgs: ['json', 'profile', 'verbose'],
  meta: {
    description: "Set one assignee's personal status on a task (not the task's overall status)",
    name: 'set-assignee-status',
  },
  async run({ api, args, formatter }) {
    const { result } = await runWithTaskScope({
      api,
      args,
      formatter,
      render: renderPretty,
      run: runTaskSetAssigneeStatus,
      schema: taskSetAssigneeStatusArgsSchema,
    });

    formatter.printInfo(`Updated assignee status on task \`${result.data.id}\`.`);
  },
});

function renderPretty({ data }: Awaited<ReturnType<typeof runTaskSetAssigneeStatus>>): string {
  return renderKeyValue([['ID', data.id]]);
}
