import { runWikiCommentDelete } from '@dooray-sdk/core';
import { resolveWikiId } from '@dooray-sdk/core/resolve';
import { z } from 'zod';

import { confirmDeletion } from '../../../shared/command/confirm-deletion';
import { defineSubcommand } from '../../../shared/command/define-subcommand';
import { globalArgs } from '../../../shared/command/global-args';
import { renderKeyValue } from '../../../shared/formatter/output-formatter';
import { parseArgsOrThrow } from '../../../shared/schema/parse-args';

export const wikiCommentDeleteArgsSchema = z
  .object({
    commentId: z.string().min(1).describe('Comment id to delete (from `dooray wiki comment-list`)'),
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
    'comment-id': {
      description: wikiCommentDeleteArgsSchema.shape.commentId.description,
      required: true,
      type: 'string',
      valueHint: 'commentId',
    },
    id: {
      description: wikiCommentDeleteArgsSchema.shape.id.description,
      required: false,
      type: 'positional',
      valueHint: 'pageId',
    },
    ref: { ...globalArgs.ref, description: wikiCommentDeleteArgsSchema.shape.ref.description, required: false },
    yes: { description: wikiCommentDeleteArgsSchema.shape.yes.description, type: 'boolean' },
  },
  globalArgs: ['json', 'profile', 'verbose'],
  meta: { description: 'Delete a wiki comment (irreversible)', name: 'comment-delete' },
  async run({ api, args, formatter }) {
    const { commentId, yes } = parseArgsOrThrow(wikiCommentDeleteArgsSchema, args);

    await confirmDeletion({
      json: args.json,
      message: `Delete comment \`${commentId}\`?`,
      skip: yes,
    });

    const { id, projectId } = resolveWikiId({ id: args.id, ref: args.ref });
    const result = await runWikiCommentDelete({ api, args: { commentId, id, projectId } });

    formatter.printData(result, renderPretty);
    formatter.printInfo(`Deleted comment \`${commentId}\`.`);
  },
});

function renderPretty({ data }: Awaited<ReturnType<typeof runWikiCommentDelete>>): string {
  return renderKeyValue([['ID', data.id]]);
}
