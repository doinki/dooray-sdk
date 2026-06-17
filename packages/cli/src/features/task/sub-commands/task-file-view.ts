import { runTaskFileView } from '@dooray-sdk/core';
import { z } from 'zod';

import { defineSubcommand } from '../../../shared/command/define-subcommand';
import { runWithTaskScope } from '../../../shared/command/run-with-task-scope';
import { renderKeyValue } from '../../../shared/formatter/output-formatter';
import { formatDateTime } from '../../../shared/formatter/text';
import { argsFromSchema } from '../../../shared/schema/derive-args';
import { requireTaskRef, taskRefShape } from '../../../shared/schema/fields';

export const taskFileViewArgsSchema = requireTaskRef(
  z.object({
    ...taskRefShape,
    fileId: z.string().min(1).meta({ hint: 'fileId' }).describe('Attachment file id (from `dooray task file-list`)'),
  }),
);

export default defineSubcommand({
  args: argsFromSchema(taskFileViewArgsSchema),
  globalArgs: ['json', 'profile', 'verbose'],
  meta: { description: "View a task attachment's metadata (use file-download for the bytes)", name: 'file-view' },
  async run({ api, args, formatter }) {
    await runWithTaskScope({
      api,
      args,
      formatter,
      render: renderPretty,
      run: runTaskFileView,
      schema: taskFileViewArgsSchema,
    });
  },
});

function renderPretty({ data }: Awaited<ReturnType<typeof runTaskFileView>>): string {
  return renderKeyValue([
    ['ID', data.id],
    ['Name', data.name],
    ['Size', data.size],
    ['Type', data.mimeType],
    ['Created', formatDateTime(data.createdAt)],
  ]);
}
