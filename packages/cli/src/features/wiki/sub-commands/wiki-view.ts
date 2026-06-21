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
  meta: { description: "View a wiki page's full detail, including body and attached file metadata", name: 'view' },
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
    ['ID', data.id],
    ['Title', data.subject],
    ['Parent', data.parentPageId],
    ['Version', data.version],
    ['Files', data.files.map((file) => `${file.name}(${file.id})`).join(', ')],
    ['Created', formatDateTime(data.createdAt)],
    ['Updated', formatDateTime(data.updatedAt)],
  ]);

  return `${content}\nBody:\n${data.body.content.trim()}`;
}
