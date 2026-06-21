import { runTaskFileUpload } from '@dooray-sdk/core';
import { z } from 'zod';

import { defineSubcommand } from '../../../shared/command/define-subcommand';
import { runWithTaskScope } from '../../../shared/command/run-with-task-scope';
import { renderId } from '../../../shared/formatter/output-formatter';
import { argsFromSchema } from '../../../shared/schema/derive-args';
import { requireTaskRef, taskRefShape } from '../../../shared/schema/fields';

export const taskFileUploadArgsSchema = requireTaskRef(
  z.object({
    ...taskRefShape,
    contentType: z
      .string()
      .trim()
      .optional()
      .meta({ hint: 'mime' })
      .describe('MIME type for the attachment (default: inferred from the extension, else application/octet-stream)'),
    filePath: z
      .string()
      .min(1)
      .meta({ hint: 'path' })
      .describe("Path of the local file to attach; the attachment keeps this file's base name"),
  }),
);

export default defineSubcommand({
  args: argsFromSchema(taskFileUploadArgsSchema),
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
      render: renderId,
      run: runTaskFileUpload,
      schema: taskFileUploadArgsSchema,
    });

    formatter.printInfo(`Uploaded file \`${result.data.id}\`.`);
  },
});
