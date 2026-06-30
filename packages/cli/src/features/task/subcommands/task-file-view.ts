import { runTaskFileView } from '@dooray-sdk/core';
import { z } from 'zod';

import { defineSubcommand } from '../../../shared/command/define-subcommand';
import { globalArgsSchema } from '../../../shared/command/global-args';
import { runWithTaskScope } from '../../../shared/command/run-with-task-scope';
import { renderKeyValue } from '../../../shared/formatter/output-formatter';
import { formatDateTime } from '../../../shared/utils/text';
import { formatCreator } from '../../../shared/utils/user';

const schema = globalArgsSchema.extend({
  fileId: z
    .string()
    .min(1)
    .meta({ hint: 'fileId', positional: true })
    .describe('Attachment id (from `dooray task file-list`).'),
});

export default defineSubcommand({
  meta: {
    description: "View a task attachment's metadata (use `dooray task file-download` for the bytes)",
    name: 'file-view',
  },
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
  schema,
});

function renderPretty({ data }: Awaited<ReturnType<typeof runTaskFileView>>): string {
  return renderKeyValue([
    ['id', data.id],
    ['name', data.name],
    ['mimeType', data.mimeType],
    ['size', data.size],
    ['author', formatCreator(data.creator)],
    ['createdAt', formatDateTime(data.createdAt)],
  ]);
}
