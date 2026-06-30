import type { WikiMoveArgs } from '@dooray-sdk/core';
import { runWikiMove } from '@dooray-sdk/core';
import { z } from 'zod';

import { confirmDeletion } from '../../../shared/command/confirm-deletion';
import { defineSubcommand } from '../../../shared/command/define-subcommand';
import { globalArgsSchema } from '../../../shared/command/global-args';
import { isJsonOutput } from '../../../shared/command/json-output';
import { runWithWikiScope } from '../../../shared/command/run-with-wiki-scope';
import type { CommandSchemaShape } from '../../../shared/schemas/derive-args';
import { yesSchema } from '../../../shared/schemas/fields';

const schema = globalArgsSchema.extend({
  beforeId: z
    .string()
    .optional()
    .meta({ hint: 'pageId' })
    .describe('Sibling page id to order this page after (from `dooray wiki list`).'),
  includeSubPages: z.boolean().optional().describe('Move child pages along too (default: true).'),
  parentId: z
    .string()
    .min(1)
    .meta({ hint: 'pageId' })
    .describe('Destination parent page id (from `dooray wiki list`).'),
  targetProjectId: z
    .string()
    .optional()
    .meta({ hint: 'projectId' })
    .describe('Destination wiki id when moving the page into another wiki (from `dooray wiki project-list`).'),
  yes: yesSchema,
} satisfies CommandSchemaShape<WikiMoveArgs>);

export default defineSubcommand({
  meta: {
    description: 'Reparent a wiki page, optionally ordering it or moving it into another wiki (irreversible)',
    name: 'move',
  },
  async run({ api, args, formatter }) {
    const { id } = await runWithWikiScope({
      api,
      args,
      confirm: ({ args: a, id }) =>
        confirmDeletion({ json: isJsonOutput(args.json), message: `Move wiki page \`${id}\`?`, skip: a.yes }),
      formatter,
      render: () => null,
      run: runWikiMove,
      schema,
    });

    formatter.printInfo(`Moved wiki page \`${id}\`.`);
  },
  schema,
});
