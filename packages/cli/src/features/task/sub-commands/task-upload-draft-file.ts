import { runTaskUploadDraftFile } from '@dooray-sdk/core';
import { z } from 'zod';

import { defineSubcommand } from '../../../shared/command/define-subcommand';
import { renderId } from '../../../shared/formatter/output-formatter';
import { argsFromSchema } from '../../../shared/utils/derive-args';
import { parseArgsOrThrow } from '../../../shared/utils/parse-args';

export const taskUploadDraftFileArgsSchema = z.object({
  contentType: z
    .string()
    .trim()
    .optional()
    .meta({ hint: 'mime' })
    .describe('MIME type for the attachment (default: inferred from the extension, else application/octet-stream)'),
  draftId: z
    .string()
    .min(1)
    .meta({ hint: 'draftId' })
    .describe('Draft id (from `dooray task create-draft`; not a task id)'),
  filePath: z.string().min(1).meta({ hint: 'path' }).describe('Path of the local file to upload'),
});

export default defineSubcommand({
  args: argsFromSchema(taskUploadDraftFileArgsSchema),
  globalArgs: ['json', 'profile', 'verbose'],
  meta: {
    description: 'Attach a local file to a draft task (use `task file-upload` for a real task)',
    name: 'upload-draft-file',
  },
  async run({ api, args, formatter }) {
    const data = parseArgsOrThrow(taskUploadDraftFileArgsSchema, args);

    const result = await runTaskUploadDraftFile({ api, args: data });

    formatter.printData(result, renderId);
    formatter.printInfo(`Uploaded file \`${result.data.id}\` to draft \`${data.draftId}\`.`);
  },
});
