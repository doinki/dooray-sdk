import { runWikiFileDelete } from '@dooray-sdk/core';
import { resolveWikiId } from '@dooray-sdk/core/resolve';
import { z } from 'zod';

import { confirmDeletion } from '../../../shared/command/confirm-deletion';
import { defineSubcommand } from '../../../shared/command/define-subcommand';
import { isJsonOutput } from '../../../shared/command/json-output';
import { renderKeyValue } from '../../../shared/formatter/output-formatter';
import { argsFromSchema } from '../../../shared/schema/derive-args';
import { confirmField, requireWikiRef, wikiRefShape } from '../../../shared/schema/fields';
import { parseArgsOrThrow, scopeRef } from '../../../shared/schema/parse-args';

export const wikiFileDeleteArgsSchema = requireWikiRef(
  z.object({
    ...wikiRefShape,
    fileId: z.string().min(1).meta({ hint: 'fileId' }).describe('Page file id to delete (from `dooray wiki view`)'),
    yes: confirmField,
  }),
);

export default defineSubcommand({
  args: argsFromSchema(wikiFileDeleteArgsSchema),
  globalArgs: ['json', 'profile', 'verbose'],
  meta: { description: 'Remove an attached file from a wiki page (irreversible)', name: 'file-delete' },
  async run({ api, args, formatter }) {
    const { fileId, yes } = parseArgsOrThrow(wikiFileDeleteArgsSchema, args);

    await confirmDeletion({
      json: isJsonOutput(args.json),
      message: `Delete attachment \`${fileId}\`?`,
      skip: yes,
    });

    const { id, projectId } = resolveWikiId(scopeRef(args));
    const result = await runWikiFileDelete({ api, args: { fileId, id, projectId } });

    formatter.printData(result, renderPretty);
    formatter.printInfo(`Deleted attachment \`${fileId}\`.`);
  },
});

function renderPretty({ data }: Awaited<ReturnType<typeof runWikiFileDelete>>): string {
  return renderKeyValue([['ID', data.id]]);
}
