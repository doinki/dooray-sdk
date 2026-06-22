import type { WikiProjectFileDownloadArgs } from '@dooray-sdk/core';
import { runWikiProjectFileDownload } from '@dooray-sdk/core';
import { z } from 'zod';

import { defineSubcommand } from '../../../shared/command/define-subcommand';
import { runWithProjectScope } from '../../../shared/command/run-with-project-scope';
import { renderKeyValue } from '../../../shared/formatter/output-formatter';
import type { CommandSchemaShape } from '../../../shared/schemas/derive-args';
import { argsFromSchema } from '../../../shared/schemas/derive-args';

const schema = z.object({
  attachFileId: z
    .string()
    .trim()
    .min(1)
    .meta({ hint: 'attachFileId', positional: true })
    .describe('Attach file id (from `dooray wiki view`).'),
  output: z
    .string()
    .trim()
    .min(1)
    .meta({ alias: 'o', hint: 'path' })
    .describe('Local path including the filename to write (e.g. `./diagram.png`). Overwrites any existing file.'),
} satisfies { output: z.ZodType<WikiProjectFileDownloadArgs['outputPath']> } & Omit<
  CommandSchemaShape<WikiProjectFileDownloadArgs>,
  'outputPath'
>);

export default defineSubcommand({
  args: argsFromSchema(schema),
  meta: { description: 'Download a wiki-level attachment to a local file', name: 'project-file-download' },
  async run({ api, args, formatter }) {
    const { result } = await runWithProjectScope({
      api,
      args,
      formatter,
      render: renderPretty,
      run: ({ api, args }) => runWikiProjectFileDownload({ api, args: { ...args, outputPath: args.output } }),
      schema,
    });

    formatter.printInfo(`Downloaded to \`${result.data.path}\`.`);
  },
});

function renderPretty({ data }: Awaited<ReturnType<typeof runWikiProjectFileDownload>>): string {
  return renderKeyValue([
    ['path', data.path],
    ['size', data.size],
  ]);
}
