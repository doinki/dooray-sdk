import { runTaskCommentCreate } from '@dooray-sdk/core';
import { BODY_MIME_TYPES } from '@dooray-sdk/core/constants';
import { z } from 'zod';

import { defineSubcommand } from '../../../shared/command/define-subcommand';
import { globalArgs } from '../../../shared/command/global-args';
import { runWithTaskScope } from '../../../shared/command/run-with-task-scope';
import { renderKeyValue } from '../../../shared/formatter/output-formatter';
import { splitCsv } from '../../../shared/schema/csv';

export const taskCommentCreateArgsSchema = z
  .object({
    body: z.string().min(1).describe('Comment body (Markdown unless --mime-type is text/html)'),
    fileIds: z
      .string()
      .transform(splitCsv)
      .optional()
      .describe('Attachment file ids (comma-separated; from `dooray task file-upload` or `dooray task file-list`)'),
    id: z
      .string()
      .optional()
      .describe('Task ID (19-digit). Looked up across all accessible projects when given alone.'),
    mimeType: z
      .enum(BODY_MIME_TYPES)
      .optional()
      .describe('Body content type — text/x-markdown or text/html (default: text/x-markdown)'),
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
    body: {
      description: taskCommentCreateArgsSchema.shape.body.description,
      required: true,
      type: 'string',
      valueHint: 'text',
    },
    'file-ids': {
      description: taskCommentCreateArgsSchema.shape.fileIds.description,
      type: 'string',
      valueHint: 'id[,id...]',
    },
    id: {
      description: taskCommentCreateArgsSchema.shape.id.description,
      required: false,
      type: 'positional',
      valueHint: 'taskId',
    },
    'mime-type': {
      description: taskCommentCreateArgsSchema.shape.mimeType.description,
      options: [...BODY_MIME_TYPES],
      type: 'enum',
    },
    ref: { ...globalArgs.ref, description: taskCommentCreateArgsSchema.shape.ref.description, required: false },
  },
  globalArgs: ['json', 'profile', 'verbose'],
  meta: { description: "Post a comment to a task's timeline", name: 'comment-create' },
  async run({ api, args, formatter }) {
    const { result } = await runWithTaskScope({
      api,
      args,
      formatter,
      render: renderPretty,
      run: runTaskCommentCreate,
      schema: taskCommentCreateArgsSchema,
    });

    formatter.printInfo(`Created comment \`${result.data.id}\`.`);
  },
});

function renderPretty({ data }: Awaited<ReturnType<typeof runTaskCommentCreate>>): string {
  return renderKeyValue([['ID', data.id]]);
}
