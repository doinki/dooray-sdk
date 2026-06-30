import { runProjectStatusUpdate } from '@dooray-sdk/core';
import { statusClassSchema } from '@dooray-sdk/core/schemas';
import { z } from 'zod';

import { defineSubcommand } from '../../../shared/command/define-subcommand';
import { globalArgsSchema } from '../../../shared/command/global-args';
import { runWithProjectScope } from '../../../shared/command/run-with-project-scope';
import { renderId } from '../../../shared/formatter/output-formatter';
import { localeNamesSchema } from '../utils/status-locale';

const schema = globalArgsSchema.extend({
  class: statusClassSchema.optional(),
  id: z.string().trim().min(1).meta({ hint: 'statusId', positional: true }).describe('Status id to update'),
  localeNames: localeNamesSchema
    .meta({ hint: 'locale=name[,...]' })
    .describe('Per-locale display names, e.g. `ko_KR=할 일,en_US=To Do`. Allowed locales: en_US, ja_JP, ko_KR, zh_CN'),
  name: z.string().trim().optional().meta({ hint: 'text' }).describe('Default status name'),
  order: z.coerce
    .number()
    .int()
    .optional()
    .describe('Sort order within the same class (integer; lower values appear first)'),
});

export default defineSubcommand({
  meta: {
    description:
      "Replace a status's class, name, order, and locale names (PUT semantics — omitted fields may be reset)",
    name: 'status-update',
  },
  async run({ api, args, formatter }) {
    const { data } = await runWithProjectScope({
      api,
      args,
      formatter,
      render: renderId,
      run: runProjectStatusUpdate,
      schema,
    });

    formatter.printInfo(`Updated status \`${data.id}\`.`);
  },
  schema,
});
