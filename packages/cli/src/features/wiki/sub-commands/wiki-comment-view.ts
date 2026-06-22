import type { WikiCommentViewArgs } from '@dooray-sdk/core';
import { runWikiCommentView } from '@dooray-sdk/core';
import { z } from 'zod';

import { defineSubcommand } from '../../../shared/command/define-subcommand';
import { runWithWikiScope } from '../../../shared/command/run-with-wiki-scope';
import { renderKeyValue } from '../../../shared/formatter/output-formatter';
import type { CommandSchemaShape } from '../../../shared/schemas/derive-args';
import { argsFromSchema } from '../../../shared/schemas/derive-args';
import { formatDateTime } from '../../../shared/utils/text';

const schema = z.object({
  commentId: z
    .string()
    .trim()
    .min(1)
    .meta({ hint: 'commentId', positional: true })
    .describe('Comment id to view (from `dooray wiki comment-list`).'),
} satisfies CommandSchemaShape<WikiCommentViewArgs>);

export default defineSubcommand({
  args: argsFromSchema(schema),
  meta: { description: "View a wiki comment's body and metadata", name: 'comment-view' },
  async run({ api, args, formatter }) {
    await runWithWikiScope({
      api,
      args,
      formatter,
      render: renderPretty,
      run: runWikiCommentView,
      schema,
    });
  },
});

function renderPretty({ data }: Awaited<ReturnType<typeof runWikiCommentView>>): string {
  const content = renderKeyValue([
    ['id', data.id],
    ['pageId', data.page.id],
    ['author', `${data.creator.member.name}(${data.creator.member.organizationMemberId})`],
    ['mimeType', data.body.mimeType],
    ['createdAt', formatDateTime(data.createdAt)],
    ['updatedAt', formatDateTime(data.modifiedAt)],
  ]);

  return `${content}\nBody:\n${data.body.content.trim()}`;
}
