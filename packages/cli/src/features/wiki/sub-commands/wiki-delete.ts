import { runWikiDelete } from '@dooray-sdk/core';
import { resolveWikiId } from '@dooray-sdk/core/resolve';
import { z } from 'zod';

import { confirmDeletion } from '../../../shared/command/confirm-deletion';
import { defineSubcommand } from '../../../shared/command/define-subcommand';
import { globalArgs } from '../../../shared/command/global-args';
import { renderKeyValue } from '../../../shared/formatter/output-formatter';
import { parseArgsOrThrow } from '../../../shared/schema/parse-args';

export const wikiDeleteArgsSchema = z
  .object({
    id: z
      .string()
      .optional()
      .describe('Wiki page ID to delete (19-digit). Looked up across all accessible wikis when given alone.'),
    ref: z
      .string()
      .optional()
      .describe(
        'Wiki page to delete instead of <pageId>: a 19-digit page ID, `<projectId>/<id>`, or a Dooray wiki URL.',
      ),
    yes: z.boolean().default(false).describe('Skip the confirmation prompt'),
  })
  .refine((args) => args.id !== undefined || args.ref !== undefined, {
    message: 'Provide the wiki page: pass <pageId> or --ref (page ID, `<projectId>/<id>`, or a Dooray wiki URL).',
    path: ['id'],
  });

export default defineSubcommand({
  args: {
    id: {
      description: wikiDeleteArgsSchema.shape.id.description,
      required: false,
      type: 'positional',
      valueHint: 'pageId',
    },
    ref: { ...globalArgs.ref, description: wikiDeleteArgsSchema.shape.ref.description, required: false },
    yes: { description: wikiDeleteArgsSchema.shape.yes.description, type: 'boolean' },
  },
  globalArgs: ['json', 'profile', 'verbose'],
  meta: { description: 'Delete a wiki page along with its child pages and attachments (irreversible)', name: 'delete' },
  async run({ api, args, formatter }) {
    const { yes } = parseArgsOrThrow(wikiDeleteArgsSchema, args);
    const { id, projectId } = resolveWikiId({ id: args.id, ref: args.ref });

    await confirmDeletion({
      json: args.json,
      message: `Delete wiki page \`${id}\` and all its children?`,
      skip: yes,
    });

    const result = await runWikiDelete({ api, args: { id, projectId } });

    formatter.printData(result, renderPretty);
    formatter.printInfo(`Deleted wiki page \`${id}\`.`);
  },
});

function renderPretty({ data }: Awaited<ReturnType<typeof runWikiDelete>>): string {
  return renderKeyValue([['ID', data.id]]);
}
