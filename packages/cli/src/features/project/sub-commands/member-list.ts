import { runProjectMemberList } from '@dooray-sdk/core';
import { ASSIGNABLE_ROLES } from '@dooray-sdk/core/constants';
import { pageSchema, sizeSchema } from '@dooray-sdk/core/schemas';
import { z } from 'zod';

import { defineSubcommand } from '../../../shared/command/define-subcommand';
import { runWithProjectScope } from '../../../shared/command/run-with-project-scope';
import { renderPagingFooter } from '../../../shared/formatter/output-formatter';
import { renderList } from '../../../shared/formatter/table';
import { splitCsv } from '../../../shared/schema/csv';

export const memberListArgsSchema = z.object({
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
    .describe(
      `Filter by role(s), comma-separated (allowed: ${ASSIGNABLE_ROLES.join(', ')}). Omit to include all roles`,
    ),
  size: sizeSchema,
});

export default defineSubcommand({
  args: {
    page: { description: memberListArgsSchema.shape.page.description, type: 'string', valueHint: 'n' },
    roles: {
      description: memberListArgsSchema.shape.roles.description,
      type: 'string',
      valueHint: 'role[,role...]',
    },
    size: { description: memberListArgsSchema.shape.size.description, type: 'string', valueHint: 'n' },
  },
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
      schema: memberListArgsSchema,
    });

    formatter.printInfo(result.data.length === 0 ? 'No members.' : renderPagingFooter(result.paging));
  },
});

function renderPretty({ data }: Awaited<ReturnType<typeof runProjectMemberList>>): null | string {
  if (data.length === 0) return null;

  return renderList(data, [
    { header: 'member_id', value: (m) => m.organizationMemberId },
    { header: 'role', value: (m) => m.role },
  ]);
}
