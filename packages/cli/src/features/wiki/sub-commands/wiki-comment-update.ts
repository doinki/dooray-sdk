import { runWikiCommentUpdate } from '@dooray-sdk/core';
import { z } from 'zod';

import { defineSubcommand } from '../../../shared/command/define-subcommand';
import { globalArgs } from '../../../shared/command/global-args';
import { runWithWikiScope } from '../../../shared/command/run-with-wiki-scope';

export const wikiCommentUpdateArgsSchema = z
  .object({
    body: z.string().min(1).describe('New comment body (Markdown). Replaces the whole body.'),
    commentId: z.string().min(1).describe('Comment id to update (from `dooray wiki comment-list`)'),
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
      description: wikiCommentUpdateArgsSchema.shape.body.description,
      required: true,
      type: 'string',
      valueHint: 'text',
    },
    'comment-id': {
      description: wikiCommentUpdateArgsSchema.shape.commentId.description,
      required: true,
      type: 'string',
      valueHint: 'commentId',
    },
    id: {
      description: wikiCommentUpdateArgsSchema.shape.id.description,
      required: false,
      type: 'positional',
      valueHint: 'pageId',
    },
    ref: { ...globalArgs.ref, description: wikiCommentUpdateArgsSchema.shape.ref.description, required: false },
  },
  globalArgs: ['json', 'profile', 'verbose'],
  meta: { description: "Replace a wiki comment's body", name: 'comment-update' },
  async run({ api, args, formatter }) {
    const { data } = await runWithWikiScope({
      api,
      args,
      formatter,
      render: () => null,
      run: runWikiCommentUpdate,
      schema: wikiCommentUpdateArgsSchema,
    });

    formatter.printInfo(`Updated comment \`${data.commentId}\`.`);
  },
});
