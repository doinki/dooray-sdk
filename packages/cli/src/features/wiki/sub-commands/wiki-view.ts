import type { WikiViewArgs } from '@dooray-sdk/core';
import { runWikiView } from '@dooray-sdk/core';
import { z } from 'zod';

import { defineSubcommand } from '../../../shared/command/define-subcommand';
import { runWithWikiScope } from '../../../shared/command/run-with-wiki-scope';
import { renderKeyValue } from '../../../shared/formatter/output-formatter';
import type { CommandSchemaShape } from '../../../shared/schemas/derive-args';
import { argsFromSchema } from '../../../shared/schemas/derive-args';
import { formatDateTime } from '../../../shared/utils/text';

const schema = z.object({} satisfies CommandSchemaShape<WikiViewArgs>);

export default defineSubcommand({
  args: argsFromSchema(schema),
  meta: { description: "View a wiki page's full detail (body, cc, and attached file metadata)", name: 'view' },
  async run({ api, args, formatter }) {
    await runWithWikiScope({
      api,
      args,
      formatter,
      render: renderPretty,
      run: runWikiView,
      schema,
    });
  },
});

function renderPretty({ data }: Awaited<ReturnType<typeof runWikiView>>): string {
  const content = renderKeyValue([
    ['id', data.id],
    ['title', data.subject],
    ['wikiId', data.wikiId],
    ['parentPageId', data.parentPageId],
    ['root', data.root],
    ['version', data.version],
    [
      'author',
      data.creator.member.name
        ? `${data.creator.member.name}(${data.creator.member.organizationMemberId})`
        : data.creator.member.organizationMemberId,
    ],
    ['cc', data.referrers.map((referrer) => referrer.member.organizationMemberId).join(', ')],
    ['mimeType', data.body.mimeType],
    [
      'files',
      data.files.map((file) => `${file.name}(${file.id}, ${file.size}, ${file.attachFileId ?? '-'})`).join(', '),
    ],
    [
      'images',
      data.images.map((image) => `${image.name}(${image.id}, ${image.size}, ${image.attachFileId ?? '-'})`).join(', '),
    ],
    ['createdAt', formatDateTime(data.createdAt)],
    ['updatedAt', formatDateTime(data.updatedAt)],
  ]);

  return `${content}\nBody:\n${data.body.content.trim()}`;
}
