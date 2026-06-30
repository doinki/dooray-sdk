import { runTaskFileUpload } from '@dooray-sdk/core';
import { z } from 'zod';

import { defineSubcommand } from '../../../shared/command/define-subcommand';
import { globalArgsSchema } from '../../../shared/command/global-args';
import { runWithTaskScope } from '../../../shared/command/run-with-task-scope';
import { renderId } from '../../../shared/formatter/output-formatter';

const schema = globalArgsSchema.extend({
  contentType: z
    .string()
    .trim()
    .optional()
    .meta({ hint: 'mime' })
    .describe('Attachment MIME type (default: inferred from the extension, else `application/octet-stream`).'),
  filePath: z
    .string()
    .min(1)
    .meta({ hint: 'path' })
    .describe("Local file to attach; the attachment keeps this file's base name."),
});

export default defineSubcommand({
  meta: {
    description: 'Attach a local file to a task (pass the returned id as a --file-ids value)',
    name: 'file-upload',
  },
  async run({ api, args, formatter }) {
    const { result } = await runWithTaskScope({
      api,
      args,
      formatter,
      render: renderId,
      run: runTaskFileUpload,
      schema,
    });

    formatter.printInfo(`Uploaded file \`${result.data.id}\`.`);
  },
  schema,
});
