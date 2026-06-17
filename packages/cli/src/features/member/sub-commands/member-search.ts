import { runMemberSearch } from '@dooray-sdk/core';
import { pageSchema, sizeSchema } from '@dooray-sdk/core/schemas';
import columnify from 'columnify';
import { z } from 'zod';

import { defineSubcommand } from '../../../shared/command/define-subcommand';
import { renderPagingFooter } from '../../../shared/formatter/output-formatter';
import { splitCsv } from '../../../shared/schema/csv';
import { parseArgsOrThrow } from '../../../shared/schema/parse-args';

export const memberSearchArgsSchema = z.object({
  email: z
    .string()
    .optional()
    .transform((value) => (value ? splitCsv(value) : []))
    .describe('Search by external email address (exact match; comma-separated for multiple)'),
  exactUserCode: z.string().optional().describe('Search by user code (exact match)'),
  name: z.string().optional().describe('Search by display name'),
  page: pageSchema,
  size: sizeSchema,
  ssoId: z.string().optional().describe('Search by SSO-provided user id (e.g., employee number)'),
  userCode: z.string().optional().describe('Search by user code (substring match)'),
});

export default defineSubcommand({
  args: {
    email: {
      description: memberSearchArgsSchema.shape.email.description,
      type: 'string',
      valueHint: 'email[,email...]',
    },
    'exact-user-code': {
      description: memberSearchArgsSchema.shape.exactUserCode.description,
      type: 'string',
      valueHint: 'code',
    },
    name: { description: memberSearchArgsSchema.shape.name.description, type: 'string', valueHint: 'name' },
    page: { description: memberSearchArgsSchema.shape.page.description, type: 'string', valueHint: 'n' },
    size: { description: memberSearchArgsSchema.shape.size.description, type: 'string', valueHint: 'n' },
    'sso-id': {
      description: memberSearchArgsSchema.shape.ssoId.description,
      type: 'string',
      valueHint: 'id',
    },
    'user-code': {
      description: memberSearchArgsSchema.shape.userCode.description,
      type: 'string',
      valueHint: 'code',
    },
  },
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
