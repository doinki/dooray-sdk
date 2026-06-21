import { runProjectMemberList } from '@dooray-sdk/core';
import { ASSIGNABLE_ROLES } from '@dooray-sdk/core/constants';
import { pageSchema, sizeSchema } from '@dooray-sdk/core/schemas';
import { z } from 'zod';

import { defineSubcommand } from '../../../shared/command/define-subcommand';
import { runWithProjectScope } from '../../../shared/command/run-with-project-scope';
import { renderPagingFooter } from '../../../shared/formatter/output-formatter';
import { splitCsv } from '../../../shared/utils/csv';
import { argsFromSchema } from '../../../shared/utils/derive-args';
import { renderList } from '../../../shared/utils/table';

const schema = z.object({
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
});

export default defineSubcommand({
  args: argsFromSchema(schema),
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
