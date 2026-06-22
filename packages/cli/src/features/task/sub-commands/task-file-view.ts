import { runTaskFileView } from '@dooray-sdk/core';
import { z } from 'zod';

import { defineSubcommand } from '../../../shared/command/define-subcommand';
import { runWithTaskScope } from '../../../shared/command/run-with-task-scope';
import { renderKeyValue } from '../../../shared/formatter/output-formatter';
import { argsFromSchema } from '../../../shared/schemas/derive-args';
import { formatDateTime } from '../../../shared/utils/text';

const schema = z.object({
  fileId: z
    .string()
    .min(1)
    .meta({ hint: 'fileId', positional: true })
    .describe('Attachment file id (from `dooray task file-list`)'),
});

export default defineSubcommand({
  args: argsFromSchema(schema),
  meta: { description: "View a task attachment's metadata (use file-download for the bytes)", name: 'file-view' },
  async run({ api, args, formatter }) {
    await runWithTaskScope({
      api,
      args,
      formatter,
      render: renderPretty,
      run: runTaskFileView,
      schema,
    });
  },
});

function renderPretty({ data }: Awaited<ReturnType<typeof runTaskFileView>>): string {
  return renderKeyValue([
    ['id', data.id],
    ['name', data.name],
    ['size', data.size],
    ['type', data.mimeType],
    ['created', formatDateTime(data.createdAt)],
  ]);
}
