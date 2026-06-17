import { runTaskFileDownload } from '@dooray-sdk/core';
import { z } from 'zod';

import { defineSubcommand } from '../../../shared/command/define-subcommand';
import { globalArgs } from '../../../shared/command/global-args';
import { runWithTaskScope } from '../../../shared/command/run-with-task-scope';
import { renderKeyValue } from '../../../shared/formatter/output-formatter';

export const taskFileDownloadArgsSchema = z
  .object({
    fileId: z.string().min(1).describe('Attachment id (from `dooray task file-list`)'),
    id: z
      .string()
      .optional()
      .describe('Task ID (19-digit). Looked up across all accessible projects when given alone.'),
    outputPath: z
      .string()
      .min(1)
      .describe('Path including the filename to write (e.g. ./report.pdf); overwrites any existing file'),
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
      description: taskFileDownloadArgsSchema.shape.fileId.description,
      required: true,
      type: 'string',
      valueHint: 'fileId',
    },
    id: {
      description: taskFileDownloadArgsSchema.shape.id.description,
      required: false,
      type: 'positional',
      valueHint: 'taskId',
    },
    'output-path': {
      description: taskFileDownloadArgsSchema.shape.outputPath.description,
      required: true,
      type: 'string',
      valueHint: 'path',
    },
    ref: { ...globalArgs.ref, description: taskFileDownloadArgsSchema.shape.ref.description, required: false },
  },
  globalArgs: ['json', 'profile', 'verbose'],
  meta: { description: "Download a task attachment's bytes to a local file", name: 'file-download' },
  async run({ api, args, formatter }) {
    const { result } = await runWithTaskScope({
      api,
      args,
      formatter,
      render: renderPretty,
      run: runTaskFileDownload,
      schema: taskFileDownloadArgsSchema,
    });

    formatter.printInfo(`Downloaded to \`${result.data.path}\`.`);
  },
});

function renderPretty({ data }: Awaited<ReturnType<typeof runTaskFileDownload>>): string {
  return renderKeyValue([
    ['Path', data.path],
    ['Size', data.size],
  ]);
}
