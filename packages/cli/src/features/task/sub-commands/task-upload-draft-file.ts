import { runTaskUploadDraftFile } from '@dooray-sdk/core';
import { z } from 'zod';

import { defineSubcommand } from '../../../shared/command/define-subcommand';
import { renderKeyValue } from '../../../shared/formatter/output-formatter';
import { parseArgsOrThrow } from '../../../shared/schema/parse-args';

export const taskUploadDraftFileArgsSchema = z.object({
  contentType: z
    .string()
    .trim()
    .optional()
    .describe('MIME type for the attachment (default: inferred from the extension, else application/octet-stream)'),
  draftId: z.string().min(1).describe('Draft id (from `dooray task create-draft`; not a task id)'),
  filePath: z.string().min(1).describe('Path of the local file to upload'),
});

export default defineSubcommand({
  args: {
    'content-type': {
      description: taskUploadDraftFileArgsSchema.shape.contentType.description,
      type: 'string',
      valueHint: 'mime',
    },
    'draft-id': {
      description: taskUploadDraftFileArgsSchema.shape.draftId.description,
      required: true,
      type: 'string',
      valueHint: 'draftId',
    },
    'file-path': {
      description: taskUploadDraftFileArgsSchema.shape.filePath.description,
      required: true,
      type: 'string',
      valueHint: 'path',
    },
  },
  globalArgs: ['json', 'profile', 'verbose'],
  meta: {
    description: 'Attach a local file to a draft task (use `task file-upload` for a real task)',
    name: 'upload-draft-file',
  },
  async run({ api, args, formatter }) {
    const data = parseArgsOrThrow(taskUploadDraftFileArgsSchema, args);

    const result = await runTaskUploadDraftFile({ api, args: data });

    formatter.printData(result, renderPretty);
    formatter.printInfo(`Uploaded file \`${result.data.id}\` to draft \`${data.draftId}\`.`);
  },
});

function renderPretty({ data }: Awaited<ReturnType<typeof runTaskUploadDraftFile>>): string {
  return renderKeyValue([['ID', data.id]]);
}
