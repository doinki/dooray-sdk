import type { WikiCreateArgs } from '@dooray-sdk/core';
import { runWikiCreate } from '@dooray-sdk/core';
import { z } from 'zod';

import { defineSubcommand } from '../../../shared/command/define-subcommand';
import { runWithProjectScope } from '../../../shared/command/run-with-project-scope';
import { renderId } from '../../../shared/formatter/output-formatter';
import type { CommandSchemaShape } from '../../../shared/schemas/derive-args';
import { argsFromSchema } from '../../../shared/schemas/derive-args';
import { splitCsv } from '../../../shared/utils/csv';

const schema = z.object({
  body: z.string().min(1).meta({ hint: 'text' }).describe('Page body (Markdown)'),
  cc: z
    .string()
    .transform(splitCsv)
    .optional()
    .describe('Referrers (comma-separated — `@me` or member ids)')
    .meta({ hint: 'user[,user...]' }),
  fileIds: z
    .string()
    .transform(splitCsv)
    .optional()
    .describe('File ids to attach (comma-separated; from `dooray wiki project-file-upload`)')
    .meta({ hint: 'id[,id...]' }),
  parentId: z.string().min(1).meta({ hint: 'pageId' }).describe('Parent page id (from `dooray wiki list`)'),
  title: z.string().trim().min(1, 'Page title must not be empty.').meta({ hint: 'text' }).describe('Page title'),
} satisfies CommandSchemaShape<WikiCreateArgs>);

export default defineSubcommand({
  args: argsFromSchema(schema),
  meta: { description: 'Create a wiki page under a parent page', name: 'create' },
  async run({ api, args, formatter }) {
    const { result } = await runWithProjectScope({
      api,
      args,
      formatter,
      render: renderId,
      run: runWikiCreate,
      schema,
    });

    formatter.printInfo(`Created wiki page \`${result.data.id}\`.`);
  },
});
