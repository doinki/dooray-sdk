import { runWikiCommentList } from '@dooray-sdk/core';
import { pageSchema, sizeSchema } from '@dooray-sdk/core/schemas';
import { z } from 'zod';

import { defineSubcommand } from '../../../shared/command/define-subcommand';
import { globalArgs } from '../../../shared/command/global-args';
import { runWithWikiScope } from '../../../shared/command/run-with-wiki-scope';
import { renderPagingFooter } from '../../../shared/formatter/output-formatter';
import { renderList } from '../../../shared/formatter/table';
import { formatDateTime, truncate } from '../../../shared/formatter/text';

export const wikiCommentListArgsSchema = z
  .object({
    all: z.boolean().optional().describe('Fetch every page of comments (overrides --page/--size)'),
    id: z
      .string()
      .optional()
      .describe('Wiki page ID (19-digit). Looked up across all accessible wikis when given alone.'),
    page: pageSchema,
    ref: z
      .string()
      .optional()
      .describe(
        'Wiki page to target instead of <pageId>: a 19-digit page ID, `<projectId>/<id>`, or a Dooray wiki URL.',
      ),
    size: sizeSchema,
  })
  .refine((args) => args.id !== undefined || args.ref !== undefined, {
    message: 'Provide the wiki page: pass <pageId> or --ref (page ID, `<projectId>/<id>`, or a Dooray wiki URL).',
    path: ['id'],
  });

export default defineSubcommand({
  args: {
    all: { description: wikiCommentListArgsSchema.shape.all.description, type: 'boolean' },
    id: {
      description: wikiCommentListArgsSchema.shape.id.description,
      required: false,
      type: 'positional',
      valueHint: 'pageId',
    },
    page: { description: wikiCommentListArgsSchema.shape.page.description, type: 'string', valueHint: 'n' },
    ref: { ...globalArgs.ref, description: wikiCommentListArgsSchema.shape.ref.description, required: false },
    size: { description: wikiCommentListArgsSchema.shape.size.description, type: 'string', valueHint: 'n' },
  },
  globalArgs: ['json', 'profile', 'verbose'],
  meta: { description: "List a wiki page's comments", name: 'comment-list' },
  async run({ api, args, formatter }) {
    const { result } = await runWithWikiScope({
      api,
      args,
      formatter,
      render: renderPretty,
      run: runWikiCommentList,
      schema: wikiCommentListArgsSchema,
    });

    formatter.printInfo(result.data.length === 0 ? 'No comments.' : renderPagingFooter(result.paging));
  },
});

function renderPretty({ data }: Awaited<ReturnType<typeof runWikiCommentList>>): null | string {
  if (data.length === 0) return null;

  return renderList(data, [
    { header: 'id', value: (c) => c.id },
    { header: 'created', value: (c) => formatDateTime(c.createdAt) },
    { header: 'body', value: (c) => truncate(c.body.content.replaceAll(/\s+/g, ' ').trim(), 60) },
  ]);
}
