import type { TaskFileDownloadArgs } from '@dooray-sdk/core';
import { runTaskFileDownload } from '@dooray-sdk/core';
import { z } from 'zod';

import { defineSubcommand } from '../../../shared/command/define-subcommand';
import { runWithTaskScope } from '../../../shared/command/run-with-task-scope';
import { renderKeyValue } from '../../../shared/formatter/output-formatter';
import type { CommandSchemaShape } from '../../../shared/schemas/derive-args';
import { argsFromSchema } from '../../../shared/schemas/derive-args';

const schema = z.object({
  fileId: z
    .string()
    .min(1)
    .meta({ hint: 'fileId', positional: true })
    .describe('Attachment id (from `dooray task file-list`)'),
  output: z
    .string()
    .min(1)
    .meta({ alias: 'o', hint: 'path' })
    .describe('Path including the filename to write (e.g. ./report.pdf); overwrites any existing file'),
} satisfies { output: z.ZodType<TaskFileDownloadArgs['outputPath']> } & Omit<
  CommandSchemaShape<TaskFileDownloadArgs>,
  'outputPath'
>);

export default defineSubcommand({
  args: argsFromSchema(schema),
  meta: { description: "Download a task attachment's bytes to a local file", name: 'file-download' },
  async run({ api, args, formatter }) {
    const { result } = await runWithTaskScope({
      api,
      args,
      formatter,
      render: renderPretty,
      run: ({ api, args }) => runTaskFileDownload({ api, args: { ...args, outputPath: args.output } }),
      schema,
    });

    formatter.printInfo(`Downloaded to \`${result.data.path}\`.`);
  },
});

function renderPretty({ data }: Awaited<ReturnType<typeof runTaskFileDownload>>): string {
  return renderKeyValue([
    ['path', data.path],
    ['size', data.size],
  ]);
}
