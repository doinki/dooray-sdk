import type { ProjectCreateArgs } from '@dooray-sdk/core';
import { runProjectCreate } from '@dooray-sdk/core';
import { PROJECT_SCOPES } from '@dooray-sdk/core/constants';
import { z } from 'zod';

import { defineSubcommand } from '../../../shared/command/define-subcommand';
import { renderId } from '../../../shared/formatter/output-formatter';
import { argsFromSchema } from '../../../shared/utils/derive-args';
import { parseArgsOrThrow } from '../../../shared/utils/parse-args';

const schema = z.object({
  categoryId: z
    .string()
    .trim()
    .optional()
    .meta({ hint: 'categoryId' })
    .describe('Project category id (managed under admin > tenant > project categories)'),
  description: z.string().trim().optional().meta({ alias: 'd', hint: 'text' }).describe('Project description'),
  name: z
    .string()
    .trim()
    .min(1)
    .meta({ hint: 'text' })
    .describe('Display name and API project code (tenant-unique; restricted charset)'),
  scope: z
    .enum(PROJECT_SCOPES)
    .describe('private: only project members can access; public: any non-guest member of the organization can access'),
} satisfies Record<keyof ProjectCreateArgs, any>);

export default defineSubcommand({
  args: argsFromSchema(schema),
  globalArgs: ['json', 'profile', 'verbose'],
  meta: {
    description: "Create a new project in the caller's organization (name = API project code)",
    name: 'create',
  },
  async run({ api, args, formatter }) {
    const data = parseArgsOrThrow(schema, args);

    const result = await runProjectCreate({
      api,
      args: data,
    });

    formatter.printData(result, renderId);
    formatter.printInfo(`Created project \`${data.name}\`.`);
  },
});
