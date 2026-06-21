import { runMemberSearch } from '@dooray-sdk/core';
import { pageSchema, sizeSchema } from '@dooray-sdk/core/schemas';
import columnify from 'columnify';
import { z } from 'zod';

import { defineSubcommand } from '../../../shared/command/define-subcommand';
import { renderPagingFooter } from '../../../shared/formatter/output-formatter';
import { argsFromSchema } from '../../../shared/utils/derive-args';
import { csvField } from '../../../shared/utils/fields';
import { parseArgsOrThrow } from '../../../shared/utils/parse-args';

export const memberSearchArgsSchema = z.object({
  email: csvField('Search by external email address (exact match; comma-separated for multiple)', 'email[,email...]'),
  exactUserCode: z.string().optional().meta({ hint: 'code' }).describe('Search by user code (exact match)'),
  name: z.string().optional().meta({ hint: 'name' }).describe('Search by display name'),
  page: pageSchema,
  size: sizeSchema,
  ssoId: z.string().optional().meta({ hint: 'id' }).describe('Search by SSO-provided user id (e.g., employee number)'),
  userCode: z.string().optional().meta({ hint: 'code' }).describe('Search by user code (substring match)'),
});

export default defineSubcommand({
  args: argsFromSchema(memberSearchArgsSchema),
  globalArgs: ['json', 'profile', 'verbose'],
  meta: {
    description: 'Search tenant members by email, user code, name, or SSO id (at least one; paginated)',
    name: 'search',
  },
  async run({ api, args, formatter }) {
    const data = parseArgsOrThrow(memberSearchArgsSchema, args);

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

  return columnify(
    data.map((member) => ({
      email: member.externalEmailAddress,
      id: member.id,
      name: member.name,
      user_code: member.userCode,
    })),
    {
      columns: ['id', 'name', 'user_code', 'email'],
    },
  );
}
