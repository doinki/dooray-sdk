import { runProjectMemberAdd } from '@dooray-sdk/core';
import { ASSIGNABLE_ROLES } from '@dooray-sdk/core/constants';
import { z } from 'zod';

import { defineSubcommand } from '../../../shared/command/define-subcommand';
import { runWithProjectScope } from '../../../shared/command/run-with-project-scope';
import { renderKeyValue } from '../../../shared/formatter/output-formatter';

export const memberAddArgsSchema = z.object({
  id: z
    .string()
    .min(1)
    .describe(
      'Organization member id to add (look up via `dooray member search`). Must already belong to the project’s organization',
    ),
  role: z.enum(ASSIGNABLE_ROLES).describe('Role to assign — admin can manage the project, member can participate'),
});

export default defineSubcommand({
  args: {
    id: {
      description: memberAddArgsSchema.shape.id.description,
      required: true,
      type: 'positional',
      valueHint: 'memberId',
    },
    role: {
      description: memberAddArgsSchema.shape.role.description,
      options: [...ASSIGNABLE_ROLES],
      required: true,
      type: 'enum',
    },
  },
  meta: { description: 'Add an existing organization member to the project', name: 'member-add' },
  async run({ api, args, formatter }) {
    const { data } = await runWithProjectScope({
      api,
      args,
      formatter,
      render: renderPretty,
      run: runProjectMemberAdd,
      schema: memberAddArgsSchema,
    });

    formatter.printInfo(`Added member \`${args.id}\` as \`${data.role}\`.`);
  },
});

function renderPretty({ data }: Awaited<ReturnType<typeof runProjectMemberAdd>>): string {
  return renderKeyValue([['Role', data.role]]);
}
