import { runProjectStatusUpdate } from '@dooray-sdk/core';
import { STATUS_CLASSES } from '@dooray-sdk/core/constants';
import { statusClassSchema } from '@dooray-sdk/core/schemas';
import { z } from 'zod';

import { defineSubcommand } from '../../../shared/command/define-subcommand';
import { runWithProjectScope } from '../../../shared/command/run-with-project-scope';
import { renderKeyValue } from '../../../shared/formatter/output-formatter';
import { localeNamesSchema } from '../../../shared/schema/status-locale';

export const statusUpdateArgsSchema = z.object({
  class: statusClassSchema.optional(),
  id: z.string().trim().min(1).describe('Status id to update'),
  localeNames: localeNamesSchema.describe(
    'Per-locale display names, e.g. `ko_KR=할 일,en_US=To Do`. Allowed locales: en_US, ja_JP, ko_KR, zh_CN',
  ),
  name: z.string().trim().optional().describe('Default status name'),
  order: z.coerce
    .number()
    .int()
    .optional()
    .describe('Sort order within the same class (integer; lower values appear first)'),
});

export default defineSubcommand({
  args: {
    class: {
      description: statusUpdateArgsSchema.shape.class.description,
      options: [...STATUS_CLASSES],
      type: 'enum',
    },
    id: {
      description: statusUpdateArgsSchema.shape.id.description,
      required: true,
      type: 'positional',
      valueHint: 'statusId',
    },
    'locale-names': {
      description: statusUpdateArgsSchema.shape.localeNames.description,
      type: 'string',
      valueHint: 'locale=name[,...]',
    },
    name: {
      description: statusUpdateArgsSchema.shape.name.description,
      type: 'string',
      valueHint: 'text',
    },
    order: {
      description: statusUpdateArgsSchema.shape.order.description,
      type: 'string',
      valueHint: 'n',
    },
  },
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
      render: renderPretty,
      run: runProjectStatusUpdate,
      schema: statusUpdateArgsSchema,
    });

    formatter.printInfo(`Updated status \`${data.name}\`.`);
  },
});

function renderPretty({ data }: Awaited<ReturnType<typeof runProjectStatusUpdate>>): string {
  return renderKeyValue([['ID', data.id]]);
}
