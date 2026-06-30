import type { ProjectCreateArgs } from '@dooray-sdk/core';
import { runProjectCreate } from '@dooray-sdk/core';
import { PROJECT_SCOPES } from '@dooray-sdk/core/constants';
import { z } from 'zod';

import { defineSubcommand } from '../../../shared/command/define-subcommand';
import { globalArgsSchema } from '../../../shared/command/global-args';
import { renderId } from '../../../shared/formatter/output-formatter';
import { parseArgsOrThrow } from '../../../shared/schemas/parse-args';

const schema = globalArgsSchema.omit({ ref: true }).extend({
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
  schema,
});
