import type { WikiFileDownloadArgs } from '@dooray-sdk/core';
import { runWikiFileDownload } from '@dooray-sdk/core';
import { z } from 'zod';

import { defineSubcommand } from '../../../shared/command/define-subcommand';
import { runWithWikiScope } from '../../../shared/command/run-with-wiki-scope';
import { renderKeyValue } from '../../../shared/formatter/output-formatter';
import type { CommandSchemaShape } from '../../../shared/schemas/derive-args';
import { argsFromSchema } from '../../../shared/schemas/derive-args';

const schema = z.object({
  fileId: z
    .string()
    .trim()
    .min(1)
    .meta({ hint: 'fileId', positional: true })
    .describe('Page file id (from `dooray wiki view`).'),
  output: z
    .string()
    .trim()
    .min(1)
    .meta({ alias: 'o', hint: 'path' })
    .describe('Local path including the filename to write (e.g. `./diagram.png`). Overwrites any existing file.'),
} satisfies {
  output: z.ZodType<WikiFileDownloadArgs['outputPath']>;
} & Omit<CommandSchemaShape<WikiFileDownloadArgs>, 'outputPath'>);

export default defineSubcommand({
  args: argsFromSchema(schema),
  meta: { description: 'Download a wiki page attachment to a local file', name: 'file-download' },
  async run({ api, args, formatter }) {
    const { result } = await runWithWikiScope({
      api,
      args,
      formatter,
      render: renderPretty,
      run: ({ api, args }) => runWikiFileDownload({ api, args: { ...args, outputPath: args.output } }),
      schema,
    });

    formatter.printInfo(`Downloaded to \`${result.data.path}\`.`);
  },
});

function renderPretty({ data }: Awaited<ReturnType<typeof runWikiFileDownload>>): string {
  return renderKeyValue([
    ['path', data.path],
    ['size', data.size],
  ]);
}
