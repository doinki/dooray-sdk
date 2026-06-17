import { runTaskFileUpload } from '@dooray-sdk/core';
import { z } from 'zod';

import { defineSubcommand } from '../../../shared/command/define-subcommand';
import { globalArgs } from '../../../shared/command/global-args';
import { runWithTaskScope } from '../../../shared/command/run-with-task-scope';
import { renderKeyValue } from '../../../shared/formatter/output-formatter';

export const taskFileUploadArgsSchema = z
  .object({
    contentType: z
      .string()
      .trim()
      .optional()
      .describe('MIME type for the attachment (default: inferred from the extension, else application/octet-stream)'),
    filePath: z
      .string()
      .min(1)
      .describe("Path of the local file to attach; the attachment keeps this file's base name"),
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
    'content-type': {
      description: taskFileUploadArgsSchema.shape.contentType.description,
      type: 'string',
      valueHint: 'mime',
    },
    'file-path': {
      description: taskFileUploadArgsSchema.shape.filePath.description,
      required: true,
      type: 'string',
      valueHint: 'path',
    },
    id: {
      description: taskFileUploadArgsSchema.shape.id.description,
      required: false,
      type: 'positional',
      valueHint: 'taskId',
    },
    ref: { ...globalArgs.ref, description: taskFileUploadArgsSchema.shape.ref.description, required: false },
  },
  globalArgs: ['json', 'profile', 'verbose'],
  meta: {
    description: 'Attach a local file to a task (the returned id can be passed as a --file-ids value)',
    name: 'file-upload',
  },
  async run({ api, args, formatter }) {
    const { result } = await runWithTaskScope({
      api,
      args,
      formatter,
      render: renderPretty,
      run: runTaskFileUpload,
      schema: taskFileUploadArgsSchema,
    });

    formatter.printInfo(`Uploaded file \`${result.data.id}\`.`);
  },
});

function renderPretty({ data }: Awaited<ReturnType<typeof runTaskFileUpload>>): string {
  return renderKeyValue([['ID', data.id]]);
}
