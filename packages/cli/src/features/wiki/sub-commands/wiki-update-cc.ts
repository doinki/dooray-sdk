import { runWikiUpdateCc } from '@dooray-sdk/core';
import { z } from 'zod';

import { defineSubcommand } from '../../../shared/command/define-subcommand';
import { globalArgs } from '../../../shared/command/global-args';
import { runWithWikiScope } from '../../../shared/command/run-with-wiki-scope';
import { splitCsv } from '../../../shared/schema/csv';

export const wikiUpdateCcArgsSchema = z
  .object({
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
  })
  .refine((args) => args.id !== undefined || args.ref !== undefined, {
    message: 'Provide the wiki page: pass <pageId> or --ref (page ID, `<projectId>/<id>`, or a Dooray wiki URL).',
    path: ['id'],
  });

export default defineSubcommand({
  args: {
    cc: {
      description: wikiUpdateCcArgsSchema.shape.cc.description,
      required: true,
      type: 'string',
      valueHint: 'user[,user...]',
    },
    id: {
      description: wikiUpdateCcArgsSchema.shape.id.description,
      required: false,
      type: 'positional',
      valueHint: 'pageId',
    },
    ref: { ...globalArgs.ref, description: wikiUpdateCcArgsSchema.shape.ref.description, required: false },
  },
  globalArgs: ['json', 'profile', 'verbose'],
  meta: { description: "Replace a wiki page's referrers, leaving its title and body unchanged", name: 'update-cc' },
  async run({ api, args, formatter }) {
    const { id } = await runWithWikiScope({
      api,
      args,
      formatter,
      render: () => null,
      run: runWikiUpdateCc,
      schema: wikiUpdateCcArgsSchema,
    });

    formatter.printInfo(`Updated referrers of wiki page \`${id}\`.`);
  },
});
