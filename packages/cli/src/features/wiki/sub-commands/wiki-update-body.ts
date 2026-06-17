import { runWikiUpdateBody } from '@dooray-sdk/core';
import { z } from 'zod';

import { defineSubcommand } from '../../../shared/command/define-subcommand';
import { globalArgs } from '../../../shared/command/global-args';
import { runWithWikiScope } from '../../../shared/command/run-with-wiki-scope';

export const wikiUpdateBodyArgsSchema = z
  .object({
    body: z.string().min(1).describe('Page body (Markdown)'),
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
    body: {
      description: wikiUpdateBodyArgsSchema.shape.body.description,
      required: true,
      type: 'string',
      valueHint: 'text',
    },
    id: {
      description: wikiUpdateBodyArgsSchema.shape.id.description,
      required: false,
      type: 'positional',
      valueHint: 'pageId',
    },
    ref: { ...globalArgs.ref, description: wikiUpdateBodyArgsSchema.shape.ref.description, required: false },
  },
  globalArgs: ['json', 'profile', 'verbose'],
  meta: { description: "Replace a wiki page's body, leaving its title and referrers unchanged", name: 'update-body' },
  async run({ api, args, formatter }) {
    const { id } = await runWithWikiScope({
      api,
      args,
      formatter,
      render: () => null,
      run: runWikiUpdateBody,
      schema: wikiUpdateBodyArgsSchema,
    });

    formatter.printInfo(`Updated body of wiki page \`${id}\`.`);
  },
});
