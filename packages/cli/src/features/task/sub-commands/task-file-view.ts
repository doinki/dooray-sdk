import { runTaskFileView } from '@dooray-sdk/core';
import { z } from 'zod';

import { defineSubcommand } from '../../../shared/command/define-subcommand';
import { globalArgs } from '../../../shared/command/global-args';
import { runWithTaskScope } from '../../../shared/command/run-with-task-scope';
import { renderKeyValue } from '../../../shared/formatter/output-formatter';
import { formatDateTime } from '../../../shared/formatter/text';

export const taskFileViewArgsSchema = z
  .object({
    fileId: z.string().min(1).describe('Attachment file id (from `dooray task file-list`)'),
    id: z
      .string()
      .optional()
      .describe('Task ID (19-digit). Looked up across all accessible projects when given alone.'),
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
    'file-id': {
      description: taskFileViewArgsSchema.shape.fileId.description,
      required: true,
      type: 'string',
      valueHint: 'fileId',
    },
    id: {
      description: taskFileViewArgsSchema.shape.id.description,
      required: false,
      type: 'positional',
      valueHint: 'taskId',
    },
    ref: { ...globalArgs.ref, description: taskFileViewArgsSchema.shape.ref.description, required: false },
  },
  globalArgs: ['json', 'profile', 'verbose'],
  meta: { description: "View a task attachment's metadata (use file-download for the bytes)", name: 'file-view' },
  async run({ api, args, formatter }) {
    await runWithTaskScope({
      api,
      args,
      formatter,
      render: renderPretty,
      run: runTaskFileView,
      schema: taskFileViewArgsSchema,
    });
  },
});

function renderPretty({ data }: Awaited<ReturnType<typeof runTaskFileView>>): string {
  return renderKeyValue([
    ['ID', data.id],
    ['Name', data.name],
    ['Size', data.size],
    ['Type', data.mimeType],
    ['Created', formatDateTime(data.createdAt)],
  ]);
}
