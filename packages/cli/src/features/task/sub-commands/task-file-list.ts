import { runTaskFileList } from '@dooray-sdk/core';
import { z } from 'zod';

import { defineSubcommand } from '../../../shared/command/define-subcommand';
import { globalArgs } from '../../../shared/command/global-args';
import { runWithTaskScope } from '../../../shared/command/run-with-task-scope';
import { renderList } from '../../../shared/formatter/table';
import { formatDateTime } from '../../../shared/formatter/text';

export const taskFileListArgsSchema = z
  .object({
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
    id: {
      description: taskFileListArgsSchema.shape.id.description,
      required: false,
      type: 'positional',
      valueHint: 'taskId',
    },
    ref: { ...globalArgs.ref, description: taskFileListArgsSchema.shape.ref.description, required: false },
  },
  globalArgs: ['json', 'profile', 'verbose'],
  meta: { description: "List a task's attached files", name: 'file-list' },
  async run({ api, args, formatter }) {
    const { result } = await runWithTaskScope({
      api,
      args,
      formatter,
      render: renderPretty,
      run: runTaskFileList,
      schema: taskFileListArgsSchema,
    });

    if (result.data.length === 0) formatter.printInfo('No files.');
  },
});

function renderPretty({ data }: Awaited<ReturnType<typeof runTaskFileList>>): null | string {
  if (data.length === 0) return null;

  return renderList(data, [
    { header: 'id', value: (f) => f.id },
    { header: 'name', value: (f) => f.name },
    { header: 'size', value: (f) => f.size },
    { header: 'type', value: (f) => f.mimeType },
    { header: 'created', value: (f) => formatDateTime(f.createdAt) },
  ]);
}
