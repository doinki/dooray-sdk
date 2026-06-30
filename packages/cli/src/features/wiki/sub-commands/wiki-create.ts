import type { WikiCreateArgs } from '@dooray-sdk/core';
import { runWikiCreate } from '@dooray-sdk/core';
import { z } from 'zod';

import { defineSubcommand } from '../../../shared/command/define-subcommand';
import { globalArgsSchema } from '../../../shared/command/global-args';
import { runWithProjectScope } from '../../../shared/command/run-with-project-scope';
import { renderKeyValue } from '../../../shared/formatter/output-formatter';
import type { CommandSchemaShape } from '../../../shared/schemas/derive-args';
import { splitCsv } from '../../../shared/utils/csv';

const schema = globalArgsSchema.extend({
  body: z.string().trim().min(1).meta({ hint: 'text' }).describe('Page body (Markdown).'),
  cc: z
    .string()
    .transform(splitCsv)
    .optional()
    .meta({ hint: 'user[,user...]' })
    .describe('cc as `@me` or member ids (comma-separated).'),
  fileIds: z
    .string()
    .transform(splitCsv)
    .optional()
    .meta({ hint: 'id[,id...]' })
    .describe('File ids to attach, comma-separated (from `dooray wiki project-file-upload`).'),
  parentId: z.string().trim().min(1).meta({ hint: 'pageId' }).describe('Parent page id (from `dooray wiki list`).'),
  title: z.string().trim().min(1).meta({ hint: 'text' }).describe('Page title.'),
} satisfies CommandSchemaShape<WikiCreateArgs>);

export default defineSubcommand({
  meta: { description: 'Create a wiki page under a parent', name: 'create' },
  async run({ api, args, formatter }) {
    const { result } = await runWithProjectScope({
      api,
      args,
      formatter,
      render: renderPretty,
      run: runWikiCreate,
      schema,
    });

    formatter.printInfo(`Created wiki page \`${result.data.id}\`.`);
  },
  schema,
});

function renderPretty({ data }: Awaited<ReturnType<typeof runWikiCreate>>): string {
  return renderKeyValue([
    ['id', data.id],
    ['parentPageId', data.parentPageId],
    ['wikiId', data.wikiId],
    ['version', data.version],
  ]);
}
