import { runWikiFileDelete } from '@dooray-sdk/core';
import { resolveWikiId } from '@dooray-sdk/core/resolve';
import { z } from 'zod';

import { confirmDeletion } from '../../../shared/command/confirm-deletion';
import { defineSubcommand } from '../../../shared/command/define-subcommand';
import { globalArgs } from '../../../shared/command/global-args';
import { renderKeyValue } from '../../../shared/formatter/output-formatter';
import { parseArgsOrThrow } from '../../../shared/schema/parse-args';

export const wikiFileDeleteArgsSchema = z
  .object({
    fileId: z.string().min(1).describe('Page file id to delete (from `dooray wiki view`)'),
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
    yes: z.boolean().default(false).describe('Skip the confirmation prompt'),
  })
  .refine((args) => args.id !== undefined || args.ref !== undefined, {
    message: 'Provide the wiki page: pass <pageId> or --ref (page ID, `<projectId>/<id>`, or a Dooray wiki URL).',
    path: ['id'],
  });

export default defineSubcommand({
  args: {
    'file-id': {
      description: wikiFileDeleteArgsSchema.shape.fileId.description,
      required: true,
      type: 'string',
      valueHint: 'fileId',
    },
    id: {
      description: wikiFileDeleteArgsSchema.shape.id.description,
      required: false,
      type: 'positional',
      valueHint: 'pageId',
    },
    ref: { ...globalArgs.ref, description: wikiFileDeleteArgsSchema.shape.ref.description, required: false },
    yes: { description: wikiFileDeleteArgsSchema.shape.yes.description, type: 'boolean' },
  },
  globalArgs: ['json', 'profile', 'verbose'],
  meta: { description: 'Remove an attached file from a wiki page (irreversible)', name: 'file-delete' },
  async run({ api, args, formatter }) {
    const { fileId, yes } = parseArgsOrThrow(wikiFileDeleteArgsSchema, args);

    await confirmDeletion({
      json: args.json,
      message: `Delete attachment \`${fileId}\`?`,
      skip: yes,
    });

    const { id, projectId } = resolveWikiId({ id: args.id, ref: args.ref });
    const result = await runWikiFileDelete({ api, args: { fileId, id, projectId } });

    formatter.printData(result, renderPretty);
    formatter.printInfo(`Deleted attachment \`${fileId}\`.`);
  },
});

function renderPretty({ data }: Awaited<ReturnType<typeof runWikiFileDelete>>): string {
  return renderKeyValue([['ID', data.id]]);
}
