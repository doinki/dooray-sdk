import { runProjectStatusCreate } from '@dooray-sdk/core';
import { STATUS_CLASSES } from '@dooray-sdk/core/constants';
import { statusClassSchema } from '@dooray-sdk/core/schemas';
import { z } from 'zod';

import { defineSubcommand } from '../../../shared/command/define-subcommand';
import { runWithProjectScope } from '../../../shared/command/run-with-project-scope';
import { renderKeyValue } from '../../../shared/formatter/output-formatter';
import { localeNamesSchema } from '../../../shared/schema/status-locale';

export const statusCreateArgsSchema = z.object({
  class: statusClassSchema,
  localeNames: localeNamesSchema.describe(
    'Per-locale display names, e.g. `ko_KR=할 일,en_US=To Do,ja_JP=登録,zh_CN=要做`. Allowed locales: en_US, ja_JP, ko_KR, zh_CN',
  ),
  name: z.string().trim().min(1).describe('Default status name shown when no locale-specific name matches the viewer'),
  order: z.coerce
    .number()
    .int()
    .optional()
    .describe('Sort order within the same class (integer; lower values appear first)'),
});

export default defineSubcommand({
  args: {
    class: {
      description: statusCreateArgsSchema.shape.class.description,
      options: [...STATUS_CLASSES],
      required: true,
      type: 'enum',
    },
    'locale-names': {
      description: statusCreateArgsSchema.shape.localeNames.description,
      type: 'string',
      valueHint: 'locale=name[,...]',
    },
    name: {
      description: statusCreateArgsSchema.shape.name.description,
      required: true,
      type: 'string',
      valueHint: 'text',
    },
    order: {
      description: statusCreateArgsSchema.shape.order.description,
      type: 'string',
      valueHint: 'n',
    },
  },
  meta: {
    description: 'Add a task status (API returns no id; verify with status-list)',
    name: 'status-create',
  },
  async run({ api, args, formatter }) {
    const { data } = await runWithProjectScope({
      api,
      args,
      formatter,
      render: renderPretty,
      run: runProjectStatusCreate,
      schema: statusCreateArgsSchema,
    });

    formatter.printInfo(`Created status \`${data.name}\`.`);
  },
});

function renderPretty({ data }: Awaited<ReturnType<typeof runProjectStatusCreate>>): string {
  return renderKeyValue([
    ['Name', data.name],
    ['Class', data.class],
    ['Order', data.order],
  ]);
}
