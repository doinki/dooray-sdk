import { runWikiCommentView } from '@dooray-sdk/core';
import { z } from 'zod';

import { defineSubcommand } from '../../../shared/command/define-subcommand';
import { globalArgs } from '../../../shared/command/global-args';
import { runWithWikiScope } from '../../../shared/command/run-with-wiki-scope';
import { renderKeyValue } from '../../../shared/formatter/output-formatter';
import { formatDateTime } from '../../../shared/formatter/text';

export const wikiCommentViewArgsSchema = z
  .object({
    commentId: z.string().min(1).describe('Comment id to view (from `dooray wiki comment-list`)'),
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
    'comment-id': {
      description: wikiCommentViewArgsSchema.shape.commentId.description,
      required: true,
      type: 'string',
      valueHint: 'commentId',
    },
    id: {
      description: wikiCommentViewArgsSchema.shape.id.description,
      required: false,
      type: 'positional',
      valueHint: 'pageId',
    },
    ref: { ...globalArgs.ref, description: wikiCommentViewArgsSchema.shape.ref.description, required: false },
  },
  globalArgs: ['json', 'profile', 'verbose'],
  meta: { description: "View a wiki comment's full body and metadata", name: 'comment-view' },
  async run({ api, args, formatter }) {
    await runWithWikiScope({
      api,
      args,
      formatter,
      render: renderPretty,
      run: runWikiCommentView,
      schema: wikiCommentViewArgsSchema,
    });
  },
});

function renderPretty({ data }: Awaited<ReturnType<typeof runWikiCommentView>>): string {
  const content = renderKeyValue([
    ['ID', data.id],
    ['Created', formatDateTime(data.createdAt)],
    ['Modified', formatDateTime(data.modifiedAt)],
  ]);

  return `${content}\nBody:\n${data.body.content.trim()}`;
}
