import { runProjectEmailView } from '@dooray-sdk/core';
import { z } from 'zod';

import { defineSubcommand } from '../../../shared/command/define-subcommand';
import { globalArgsSchema } from '../../../shared/command/global-args';
import { runWithProjectScope } from '../../../shared/command/run-with-project-scope';
import { renderKeyValue } from '../../../shared/formatter/output-formatter';

const schema = globalArgsSchema.extend({
  id: z
    .string()
    .min(1)
    .meta({ hint: 'emailId', positional: true })
    .describe('Project email address id (returned by `email-create`)'),
});

export default defineSubcommand({
  meta: {
    description: 'Show a project inbound email address by id',
    name: 'email-view',
  },
  async run({ api, args, formatter }) {
    await runWithProjectScope({
      api,
      args,
      formatter,
      render: renderPretty,
      run: runProjectEmailView,
      schema,
    });
  },
  schema,
});

function renderPretty({ data }: Awaited<ReturnType<typeof runProjectEmailView>>): string {
  return renderKeyValue([
    ['id', data.id],
    ['name', data.name],
    ['email', data.emailAddress],
  ]);
}
