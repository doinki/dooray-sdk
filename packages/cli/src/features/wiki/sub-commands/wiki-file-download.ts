import { runWikiFileDownload } from '@dooray-sdk/core';
import { z } from 'zod';

import { defineSubcommand } from '../../../shared/command/define-subcommand';
import { runWithWikiScope } from '../../../shared/command/run-with-wiki-scope';
import { renderKeyValue } from '../../../shared/formatter/output-formatter';
import { argsFromSchema } from '../../../shared/schema/derive-args';
import { requireWikiRef, wikiRefShape } from '../../../shared/schema/fields';

export const wikiFileDownloadArgsSchema = requireWikiRef(
  z.object({
    ...wikiRefShape,
    fileId: z.string().min(1).meta({ hint: 'fileId' }).describe('Page file id (from `dooray wiki view`)'),
    outputPath: z
      .string()
      .min(1)
      .meta({ hint: 'path' })
      .describe('Path including the filename to write (e.g. ./diagram.png); overwrites any existing file'),
  }),
);

export default defineSubcommand({
  args: argsFromSchema(wikiFileDownloadArgsSchema),
  globalArgs: ['json', 'profile', 'verbose'],
  meta: { description: 'Download a wiki page attachment to a local file', name: 'file-download' },
  async run({ api, args, formatter }) {
    const { result } = await runWithWikiScope({
      api,
      args,
      formatter,
      render: renderPretty,
      run: runWikiFileDownload,
      schema: wikiFileDownloadArgsSchema,
    });

    formatter.printInfo(`Downloaded to \`${result.data.path}\`.`);
  },
});

function renderPretty({ data }: Awaited<ReturnType<typeof runWikiFileDownload>>): string {
  return renderKeyValue([
    ['Path', data.path],
    ['Size', data.size],
  ]);
}
