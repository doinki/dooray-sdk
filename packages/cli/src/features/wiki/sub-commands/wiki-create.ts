import { runWikiCreate } from '@dooray-sdk/core';
import { z } from 'zod';

import { defineSubcommand } from '../../../shared/command/define-subcommand';
import { runWithProjectScope } from '../../../shared/command/run-with-project-scope';
import { renderKeyValue } from '../../../shared/formatter/output-formatter';
import { argsFromSchema } from '../../../shared/schema/derive-args';
import { csvField } from '../../../shared/schema/fields';

export const wikiCreateArgsSchema = z.object({
  body: z.string().min(1).meta({ hint: 'text' }).describe('Page body (Markdown)'),
  cc: csvField('Referrers (comma-separated — `@me` or member ids)', 'user[,user...]'),
  fileIds: csvField('File ids to attach (comma-separated; from `dooray wiki project-file-upload`)', 'id[,id...]'),
  parentId: z.string().min(1).meta({ hint: 'pageId' }).describe('Parent page id (from `dooray wiki list`)'),
  title: z.string().trim().min(1, 'Page title must not be empty.').meta({ hint: 'text' }).describe('Page title'),
});

export default defineSubcommand({
  args: argsFromSchema(wikiCreateArgsSchema),
  meta: { description: 'Create a wiki page under a parent page', name: 'create' },
  async run({ api, args, formatter }) {
    const { result } = await runWithProjectScope({
      api,
      args,
      formatter,
      render: renderPretty,
      run: runWikiCreate,
      schema: wikiCreateArgsSchema,
    });

    formatter.printInfo(`Created wiki page \`${result.data.id}\`.`);
  },
});

function renderPretty({ data }: Awaited<ReturnType<typeof runWikiCreate>>): string {
  return renderKeyValue([['ID', data.id]]);
}
