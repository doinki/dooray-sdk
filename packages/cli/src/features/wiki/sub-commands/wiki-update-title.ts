import { runWikiUpdateTitle } from '@dooray-sdk/core';
import { z } from 'zod';

import { defineSubcommand } from '../../../shared/command/define-subcommand';
import { globalArgs } from '../../../shared/command/global-args';
import { runWithWikiScope } from '../../../shared/command/run-with-wiki-scope';

export const wikiUpdateTitleArgsSchema = z
  .object({
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
    id: {
      description: wikiUpdateTitleArgsSchema.shape.id.description,
      required: false,
      type: 'positional',
      valueHint: 'pageId',
    },
    ref: { ...globalArgs.ref, description: wikiUpdateTitleArgsSchema.shape.ref.description, required: false },
    title: {
      description: wikiUpdateTitleArgsSchema.shape.title.description,
      required: true,
      type: 'string',
      valueHint: 'text',
    },
  },
  globalArgs: ['json', 'profile', 'verbose'],
  meta: { description: "Replace a wiki page's title, leaving its body and referrers unchanged", name: 'update-title' },
  async run({ api, args, formatter }) {
    const { id } = await runWithWikiScope({
      api,
      args,
      formatter,
      render: () => null,
      run: runWikiUpdateTitle,
      schema: wikiUpdateTitleArgsSchema,
    });

    formatter.printInfo(`Updated title of wiki page \`${id}\`.`);
  },
});
