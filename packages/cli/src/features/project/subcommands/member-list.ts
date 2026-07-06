import type { ProjectMemberListArgs } from '@dooray-sdk/core';
import { runProjectMemberList } from '@dooray-sdk/core';
import { ASSIGNABLE_ROLES } from '@dooray-sdk/core/constants';
import { pageSchema, sizeSchema } from '@dooray-sdk/core/schemas';
import { z } from 'zod';

import { defineSubcommand } from '../../../shared/command/define-subcommand';
import { globalArgsSchema } from '../../../shared/command/global-args';
import { runWithProjectScope } from '../../../shared/command/run-with-project-scope';
import type { CommandSchemaShape } from '../../../shared/schemas/derive-args';
import { splitCsv } from '../../../shared/utils/csv';
import { renderList } from '../../../shared/utils/table';

const schema = globalArgsSchema.extend({
  page: pageSchema,
  roles: z
    .string()
    .optional()
    .transform((value) => {
      if (!value) return;
      const tokens = splitCsv(value);
      return tokens.length > 0 ? tokens : undefined;
    })
    .pipe(z.array(z.enum(ASSIGNABLE_ROLES)).optional())
    .meta({ hint: 'role[,role...]' })
    .describe(
      `Filter by role(s), comma-separated (allowed: ${ASSIGNABLE_ROLES.join(', ')}). Omit to include all roles`,
    ),
  size: sizeSchema,
} satisfies CommandSchemaShape<ProjectMemberListArgs>);

export default defineSubcommand({
  meta: {
    description: 'List project members (organizationMemberId + role)',
    name: 'member-list',
  },
  async run({ api, args, formatter }) {
    const { result } = await runWithProjectScope({
      api,
      args,
      formatter,
      render: renderPretty,
      run: runProjectMemberList,
      schema,
    });

    formatter.printListFooter(result, 'members');
  },
  schema,
});

function renderPretty({ data }: Awaited<ReturnType<typeof runProjectMemberList>>): null | string {
  if (data.length === 0) return null;

  return renderList(data, [
    { header: 'memberId', value: (m) => m.organizationMemberId },
    { header: 'role', value: (m) => m.role },
  ]);
}
