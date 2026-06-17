import { runWikiView } from '@dooray-sdk/core';
import { z } from 'zod';

import { defineSubcommand } from '../../../shared/command/define-subcommand';
import { globalArgs } from '../../../shared/command/global-args';
import { runWithWikiScope } from '../../../shared/command/run-with-wiki-scope';
import { renderKeyValue } from '../../../shared/formatter/output-formatter';
import { formatDateTime } from '../../../shared/formatter/text';

export const wikiViewArgsSchema = z
  .object({
    id: z
      .string()
      .optional()
      .describe('Wiki page ID to view (19-digit). Looked up across all accessible wikis when given alone.'),
    ref: z
      .string()
      .optional()
      .describe('Wiki page to view instead of <pageId>: a 19-digit page ID, `<projectId>/<id>`, or a Dooray wiki URL.'),
  })
  .refine((args) => args.id !== undefined || args.ref !== undefined, {
    message: 'Provide the wiki page: pass <pageId> or --ref (page ID, `<projectId>/<id>`, or a Dooray wiki URL).',
    path: ['id'],
  });

export default defineSubcommand({
  args: {
    id: {
      description: wikiViewArgsSchema.shape.id.description,
      required: false,
      type: 'positional',
      valueHint: 'pageId',
    },
    ref: { ...globalArgs.ref, description: wikiViewArgsSchema.shape.ref.description, required: false },
  },
  globalArgs: ['json', 'profile', 'verbose'],
  meta: { description: "View a wiki page's full detail, including body and attached file metadata", name: 'view' },
  async run({ api, args, formatter }) {
    await runWithWikiScope({
      api,
      args,
      formatter,
      render: renderPretty,
      run: runWikiView,
      schema: wikiViewArgsSchema,
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
