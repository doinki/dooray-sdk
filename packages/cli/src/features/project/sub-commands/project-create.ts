import { runProjectCreate } from '@dooray-sdk/core';
import { PROJECT_SCOPES } from '@dooray-sdk/core/constants';
import { z } from 'zod';

import { defineSubcommand } from '../../../shared/command/define-subcommand';
import { renderKeyValue } from '../../../shared/formatter/output-formatter';
import { parseArgsOrThrow } from '../../../shared/schema/parse-args';

export const projectCreateArgsSchema = z.object({
  categoryId: z
    .string()
    .trim()
    .optional()
    .describe('Project category id (managed under admin > tenant > project categories)'),
  description: z.string().trim().optional().describe('Project description'),
  name: z.string().trim().min(1).describe('Display name and API project code (tenant-unique; restricted charset)'),
  scope: z
    .enum(PROJECT_SCOPES)
    .describe('private: only project members can access; public: any non-guest member of the organization can access'),
});

export default defineSubcommand({
  args: {
    'category-id': {
      description: projectCreateArgsSchema.shape.categoryId.description,
      type: 'string',
      valueHint: 'categoryId',
    },
    description: {
      alias: 'd',
      description: projectCreateArgsSchema.shape.description.description,
      type: 'string',
      valueHint: 'text',
    },
    name: {
      description: projectCreateArgsSchema.shape.name.description,
      required: true,
      type: 'string',
      valueHint: 'text',
    },
    scope: {
      description: projectCreateArgsSchema.shape.scope.description,
      options: [...PROJECT_SCOPES],
      required: true,
      type: 'enum',
    },
  },
  globalArgs: ['json', 'profile', 'verbose'],
  meta: {
    description: "Create a new project in the caller's organization (name = API project code)",
    name: 'create',
  },
  async run({ api, args, formatter }) {
    const data = parseArgsOrThrow(projectCreateArgsSchema, args);

    const result = await runProjectCreate({
      api,
      args: data,
    });

    formatter.printData(result, renderPretty);
    formatter.printInfo(`Created project \`${data.name}\`.`);
  },
});

function renderPretty({ data: result }: Awaited<ReturnType<typeof runProjectCreate>>): string {
  return renderKeyValue([['ID', result.id]]);
}
