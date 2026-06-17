import { runWikiDelete } from '@dooray-sdk/core';
import { resolveWikiId } from '@dooray-sdk/core/resolve';
import { z } from 'zod';

import { confirmDeletion } from '../../../shared/command/confirm-deletion';
import { defineSubcommand } from '../../../shared/command/define-subcommand';
import { isJsonOutput } from '../../../shared/command/json-output';
import { renderKeyValue } from '../../../shared/formatter/output-formatter';
import { argsFromSchema } from '../../../shared/schema/derive-args';
import { confirmField, requireWikiRef, wikiRefShape } from '../../../shared/schema/fields';
import { parseArgsOrThrow, scopeRef } from '../../../shared/schema/parse-args';

export const wikiDeleteArgsSchema = requireWikiRef(
  z.object({
    ...wikiRefShape,
    yes: confirmField,
  }),
);

export default defineSubcommand({
  args: argsFromSchema(wikiDeleteArgsSchema),
  globalArgs: ['json', 'profile', 'verbose'],
  meta: { description: 'Delete a wiki page along with its child pages and attachments (irreversible)', name: 'delete' },
  async run({ api, args, formatter }) {
    const { yes } = parseArgsOrThrow(wikiDeleteArgsSchema, args);
    const { id, projectId } = resolveWikiId(scopeRef(args));

    await confirmDeletion({
      json: isJsonOutput(args.json),
      message: `Delete wiki page \`${id}\` and all its children?`,
      skip: yes,
    });

    const result = await runWikiDelete({ api, args: { id, projectId } });

    formatter.printData(result, renderPretty);
    formatter.printInfo(`Deleted wiki page \`${id}\`.`);
  },
});

function renderPretty({ data }: Awaited<ReturnType<typeof runWikiDelete>>): string {
  return renderKeyValue([['ID', data.id]]);
}
