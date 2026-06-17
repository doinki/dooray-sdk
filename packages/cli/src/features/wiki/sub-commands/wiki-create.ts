import { runWikiCreate } from '@dooray-sdk/core';
import { z } from 'zod';

import { defineSubcommand } from '../../../shared/command/define-subcommand';
import { runWithProjectScope } from '../../../shared/command/run-with-project-scope';
import { renderKeyValue } from '../../../shared/formatter/output-formatter';
import { splitCsv } from '../../../shared/schema/csv';

export const wikiCreateArgsSchema = z.object({
  body: z.string().min(1).describe('Page body (Markdown)'),
  cc: z.string().transform(splitCsv).optional().describe('Referrers (comma-separated — `@me` or member ids)'),
  fileIds: z
    .string()
    .transform(splitCsv)
    .optional()
    .describe('File ids to attach (comma-separated; from `dooray wiki project-file-upload`)'),
  parentId: z.string().min(1).describe('Parent page id (from `dooray wiki list`)'),
  title: z.string().trim().min(1, 'Page title must not be empty.').describe('Page title'),
});

export default defineSubcommand({
  args: {
    body: {
      description: wikiCreateArgsSchema.shape.body.description,
      required: true,
      type: 'string',
      valueHint: 'text',
    },
    cc: { description: wikiCreateArgsSchema.shape.cc.description, type: 'string', valueHint: 'user[,user...]' },
    'file-ids': {
      description: wikiCreateArgsSchema.shape.fileIds.description,
      type: 'string',
      valueHint: 'id[,id...]',
    },
    'parent-id': {
      description: wikiCreateArgsSchema.shape.parentId.description,
      required: true,
      type: 'string',
      valueHint: 'pageId',
    },
    title: {
      description: wikiCreateArgsSchema.shape.title.description,
      required: true,
      type: 'string',
      valueHint: 'text',
    },
  },
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
