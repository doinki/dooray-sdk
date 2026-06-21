import type { MemberSearchArgs } from '@dooray-sdk/core';
import { runMemberSearch } from '@dooray-sdk/core';
import { pageSchema, sizeSchema } from '@dooray-sdk/core/schemas';
import { z } from 'zod';

import { defineSubcommand } from '../../../shared/command/define-subcommand';
import { renderPagingFooter } from '../../../shared/formatter/output-formatter';
import { splitCsv } from '../../../shared/utils/csv';
import { argsFromSchema } from '../../../shared/utils/derive-args';
import { parseArgsOrThrow } from '../../../shared/utils/parse-args';
import { renderList } from '../../../shared/utils/table';

const schema = z.object({
  email: z
    .string()
    .transform(splitCsv)
    .optional()
    .describe('Filter by external email (exact match; comma-separated)')
    .meta({ hint: 'email[,email...]' }),
  exactUserCode: z.string().optional().meta({ hint: 'code' }).describe('Filter by user code (exact match)'),
  name: z.string().optional().describe('Filter by display name'),
  page: pageSchema,
  size: sizeSchema,
  ssoId: z.string().optional().meta({ hint: 'id' }).describe('Filter by SSO/IdP user id (e.g. employee number)'),
  userCode: z.string().optional().meta({ hint: 'code' }).describe('Filter by user code (substring match)'),
} satisfies Record<keyof MemberSearchArgs, any>);

export default defineSubcommand({
  args: argsFromSchema(schema),
  globalArgs: ['json', 'profile', 'verbose'],
  meta: {
    description: 'Search tenant members by email, user code, name, or SSO id (at least one; paginated)',
    name: 'search',
  },
  async run({ api, args, formatter }) {
    const data = parseArgsOrThrow(schema, args);

    const result = await runMemberSearch({
      api,
      args: data,
    });

    formatter.printData(result, renderPretty);
    formatter.printInfo(result.data.length === 0 ? 'No members.' : renderPagingFooter(result.paging));
  },
});

function renderPretty({ data }: Awaited<ReturnType<typeof runMemberSearch>>): null | string {
  if (data.length === 0) return null;

  return renderList(data, [
    { header: 'id', value: (member) => member.id },
    { header: 'name', value: (member) => member.name },
    { header: 'user_code', value: (member) => member.userCode },
    { header: 'email', value: (member) => member.externalEmailAddress },
  ]);
}
