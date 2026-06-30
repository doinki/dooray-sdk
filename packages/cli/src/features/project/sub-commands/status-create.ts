import { runProjectStatusCreate } from '@dooray-sdk/core';
import { statusClassSchema } from '@dooray-sdk/core/schemas';
import { z } from 'zod';

import { defineSubcommand } from '../../../shared/command/define-subcommand';
import { globalArgsSchema } from '../../../shared/command/global-args';
import { runWithProjectScope } from '../../../shared/command/run-with-project-scope';
import { renderKeyValue } from '../../../shared/formatter/output-formatter';
import { localeNamesSchema } from '../utils/status-locale';

const schema = globalArgsSchema.extend({
  class: statusClassSchema,
  localeNames: localeNamesSchema
    .meta({ hint: 'locale=name[,...]' })
    .describe(
      'Per-locale display names, e.g. `ko_KR=할 일,en_US=To Do,ja_JP=登録,zh_CN=要做`. Allowed locales: en_US, ja_JP, ko_KR, zh_CN',
    ),
  name: z
    .string()
    .trim()
    .min(1)
    .meta({ hint: 'text' })
    .describe('Default status name shown when no locale-specific name matches the viewer'),
  order: z.coerce
    .number()
    .int()
    .optional()
    .describe('Sort order within the same class (integer; lower values appear first)'),
});

export default defineSubcommand({
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
      schema,
    });

    formatter.printInfo(`Created status \`${data.name}\`.`);
  },
  schema,
});

function renderPretty({ data }: Awaited<ReturnType<typeof runProjectStatusCreate>>): string {
  return renderKeyValue([
    ['name', data.name],
    ['class', data.class],
    ['order', data.order],
  ]);
}
