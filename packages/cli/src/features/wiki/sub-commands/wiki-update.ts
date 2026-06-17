import { runWikiUpdate } from '@dooray-sdk/core';
import { z } from 'zod';

import { defineSubcommand } from '../../../shared/command/define-subcommand';
import { globalArgs } from '../../../shared/command/global-args';
import { runWithWikiScope } from '../../../shared/command/run-with-wiki-scope';
import { splitCsv } from '../../../shared/schema/csv';

export const wikiUpdateArgsSchema = z
  .object({
    body: z.string().min(1).describe('Page body (Markdown)'),
    cc: z
      .string()
      .transform(splitCsv)
      .describe('Referrers (comma-separated — `@me` or member ids). Replaces the whole list.'),
    id: z
      .string()
      .optional()
      .describe('Wiki page ID (19-digit). Looked up across all accessible wikis when given alone.'),
    ref: z
      .string()
      .optional()
      .describe(
        'Wiki page to target instead of <pageId>: a 19-digit page ID, `<projectId>/<id>`, or a Dooray wiki URL.',
      ),
    title: z.string().trim().min(1, 'Page title must not be empty.').describe('Page title'),
  })
  .refine((args) => args.id !== undefined || args.ref !== undefined, {
    message: 'Provide the wiki page: pass <pageId> or --ref (page ID, `<projectId>/<id>`, or a Dooray wiki URL).',
    path: ['id'],
  });

export default defineSubcommand({
  args: {
    body: {
      description: wikiUpdateArgsSchema.shape.body.description,
      required: true,
      type: 'string',
      valueHint: 'text',
    },
    cc: {
      description: wikiUpdateArgsSchema.shape.cc.description,
      required: true,
      type: 'string',
      valueHint: 'user[,user...]',
    },
    id: {
      description: wikiUpdateArgsSchema.shape.id.description,
      required: false,
      type: 'positional',
      valueHint: 'pageId',
    },
    ref: { ...globalArgs.ref, description: wikiUpdateArgsSchema.shape.ref.description, required: false },
    title: {
      description: wikiUpdateArgsSchema.shape.title.description,
      required: true,
      type: 'string',
      valueHint: 'text',
    },
  },
  globalArgs: ['json', 'profile', 'verbose'],
  meta: {
    description: "Replace a wiki page's title, body, and referrers together",
    name: 'update',
  },
  async run({ api, args, formatter }) {
    const { id } = await runWithWikiScope({
      api,
      args,
      formatter,
      render: () => null,
      run: runWikiUpdate,
      schema: wikiUpdateArgsSchema,
    });

    formatter.printInfo(`Updated wiki page \`${id}\`.`);
  },
});
