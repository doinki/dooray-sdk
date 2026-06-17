import { runProjectEmailView } from '@dooray-sdk/core';
import { z } from 'zod';

import { defineSubcommand } from '../../../shared/command/define-subcommand';
import { runWithProjectScope } from '../../../shared/command/run-with-project-scope';
import { renderKeyValue } from '../../../shared/formatter/output-formatter';
import { argsFromSchema } from '../../../shared/schema/derive-args';

export const emailViewArgsSchema = z.object({
  id: z
    .string()
    .min(1)
    .meta({ hint: 'emailId', positional: true })
    .describe('Project email address id (returned by `email-create`)'),
});

export default defineSubcommand({
  args: argsFromSchema(emailViewArgsSchema),
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
      schema: emailViewArgsSchema,
    });
  },
});

function renderPretty({ data }: Awaited<ReturnType<typeof runProjectEmailView>>): string {
  return renderKeyValue([
    ['ID', data.id],
    ['Name', data.name],
    ['Email', data.emailAddress],
  ]);
}
