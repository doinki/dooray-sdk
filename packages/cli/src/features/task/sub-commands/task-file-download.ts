import { runTaskFileDownload } from '@dooray-sdk/core';
import { z } from 'zod';

import { defineSubcommand } from '../../../shared/command/define-subcommand';
import { runWithTaskScope } from '../../../shared/command/run-with-task-scope';
import { renderKeyValue } from '../../../shared/formatter/output-formatter';
import { argsFromSchema } from '../../../shared/utils/derive-args';
import { requireTaskRef, taskRefShape } from '../../../shared/utils/fields';

const schema = requireTaskRef(
  z.object({
    ...taskRefShape,
    fileId: z.string().min(1).meta({ hint: 'fileId' }).describe('Attachment id (from `dooray task file-list`)'),
    outputPath: z
      .string()
      .min(1)
      .meta({ hint: 'path' })
      .describe('Path including the filename to write (e.g. ./report.pdf); overwrites any existing file'),
  }),
);

export default defineSubcommand({
  args: argsFromSchema(schema),
  globalArgs: ['json', 'profile', 'verbose'],
  meta: { description: "Download a task attachment's bytes to a local file", name: 'file-download' },
  async run({ api, args, formatter }) {
    const { result } = await runWithTaskScope({
      api,
      args,
      formatter,
      render: renderPretty,
      run: runTaskFileDownload,
      schema,
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
