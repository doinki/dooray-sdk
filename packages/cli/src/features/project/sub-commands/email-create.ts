import { runProjectEmailCreate } from '@dooray-sdk/core';
import { z } from 'zod';

import { defineSubcommand } from '../../../shared/command/define-subcommand';
import { runWithProjectScope } from '../../../shared/command/run-with-project-scope';
import { renderKeyValue } from '../../../shared/formatter/output-formatter';

export const emailCreateArgsSchema = z.object({
  email: z
    .email('Enter a valid email address.')
    .describe(
      'Email address to register. Domain must be the tenant’s configured mail domain (`<sub>.dooray.com` or a registered custom domain); local part must be unused tenant-wide',
    ),
  name: z
    .string()
    .min(1, 'Display name must not be empty.')
    .describe('Display name shown alongside the address (e.g. in mail clients)'),
});

export default defineSubcommand({
  args: {
    email: {
      description: emailCreateArgsSchema.shape.email.description,
      required: true,
      type: 'string',
      valueHint: 'email',
    },
    name: {
      description: emailCreateArgsSchema.shape.name.description,
      required: true,
      type: 'string',
      valueHint: 'text',
    },
  },
  meta: {
    description: 'Create an inbound email address (incoming mail becomes a task; address must be unique)',
    name: 'email-create',
  },
  async run({ api, args, formatter }) {
    const { data } = await runWithProjectScope({
      api,
      args,
      formatter,
      render: renderPretty,
      run: runProjectEmailCreate,
      schema: emailCreateArgsSchema,
    });

    formatter.printInfo(`Created inbound email address \`${data.email}\`.`);
  },
});

function renderPretty({ data }: Awaited<ReturnType<typeof runProjectEmailCreate>>): string {
  return renderKeyValue([['ID', data.id]]);
}
