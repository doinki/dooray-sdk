import type { MemberSearchArgs } from '@dooray-sdk/core';
import { runMemberSearch } from '@dooray-sdk/core';
import { pageSchema, sizeSchema } from '@dooray-sdk/core/schemas';
import { z } from 'zod';

import { defineSubcommand } from '../../../shared/command/define-subcommand';
import { globalArgsSchema } from '../../../shared/command/global-args';
import type { CommandSchemaShape } from '../../../shared/schemas/derive-args';
import { parseArgsOrThrow } from '../../../shared/schemas/parse-args';
import { splitCsv } from '../../../shared/utils/csv';
import { renderList } from '../../../shared/utils/table';

const schema = globalArgsSchema
  .omit({ ref: true })
  .extend({
    email: z
      .string()
      .transform(splitCsv)
      .optional()
      .meta({ hint: 'email[,email...]' })
      .describe('Filter by external email (exact match; comma-separated)'),
    exactUserCode: z.string().optional().meta({ hint: 'code' }).describe('Filter by user code (exact match)'),
    name: z.string().optional().describe('Filter by display name'),
    page: pageSchema,
    size: sizeSchema,
    ssoId: z.string().optional().meta({ hint: 'id' }).describe('Filter by SSO/IdP user id (e.g. employee number)'),
    userCode: z.string().optional().meta({ hint: 'code' }).describe('Filter by user code (substring match)'),
  } satisfies CommandSchemaShape<MemberSearchArgs>)
  .refine(
    (args) => args.email?.length || args.exactUserCode || args.name || args.ssoId || args.userCode,
    'Provide at least one filter: --email, --exact-user-code, --name, --sso-id, or --user-code.',
  );

export default defineSubcommand({
  meta: {
    description: 'Search tenant members by email, user code, name, or SSO id — at least one filter (paginated)',
    name: 'search',
  },
  async run({ api, args, formatter }) {
    const data = parseArgsOrThrow(schema, args);

    const result = await runMemberSearch({
      api,
      args: data,
    });

    formatter.printData(result, renderPretty);
    formatter.printListFooter(result, 'members');
  },
  schema,
});

function renderPretty({ data }: Awaited<ReturnType<typeof runMemberSearch>>): null | string {
  if (data.length === 0) return null;

  return renderList(data, [
    { header: 'id', value: (member) => member.id },
    { header: 'name', value: (member) => member.name },
    { header: 'userCode', value: (member) => member.userCode },
    { header: 'email', value: (member) => member.externalEmailAddress },
  ]);
}
