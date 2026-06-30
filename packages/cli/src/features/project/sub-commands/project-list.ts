import type { ProjectListArgs } from '@dooray-sdk/core';
import { runProjectList } from '@dooray-sdk/core';
import { PROJECT_SCOPES, PROJECT_STATES, PROJECT_TYPES } from '@dooray-sdk/core/constants';
import { pageSchema, sizeSchema } from '@dooray-sdk/core/schemas';
import { z } from 'zod';

import { defineSubcommand } from '../../../shared/command/define-subcommand';
import { globalArgsSchema } from '../../../shared/command/global-args';
import { renderPagingFooter } from '../../../shared/formatter/output-formatter';
import { parseArgsOrThrow } from '../../../shared/schemas/parse-args';
import { renderList } from '../../../shared/utils/table';

const schema = globalArgsSchema.omit({ ref: true }).extend({
  member: z
    .string()
    .default('me')
    .meta({ hint: 'member' })
    .describe('Filter to projects this member belongs to. Use `me` for the calling user (default: `me`)'),
  page: pageSchema,
  scope: z
    .enum(PROJECT_SCOPES)
    .optional()
    .describe(
      'Access scope of public projects — private: members-only; public: open to non-guest org members (default: public)',
    ),
  size: sizeSchema,
  state: z.enum(PROJECT_STATES).optional().describe('Project state filter — active/archived/deleted (default: active)'),
  type: z
    .enum(PROJECT_TYPES)
    .optional()
    .describe(
      'Project type filter — `private` includes 1-on-1 personal projects (which always appear first); `public` excludes them (default: public)',
    ),
} satisfies Record<keyof ProjectListArgs, any>);

export default defineSubcommand({
  meta: { description: 'List projects accessible to the caller, with filters and pagination', name: 'list' },
  async run({ api, args, formatter }) {
    const data = parseArgsOrThrow(schema, args);

    const result = await runProjectList({
      api,
      args: data,
    });

    formatter.printData(result, renderPretty);
    formatter.printInfo(result.data.length === 0 ? 'No projects.' : renderPagingFooter(result.paging));
  },
  schema,
});

function renderPretty({ data }: Awaited<ReturnType<typeof runProjectList>>): null | string {
  if (data.length === 0) return null;

  return renderList(data, [
    { header: 'id', value: (p) => p.id },
    { header: 'name', value: (p) => p.code },
    { header: 'description', value: (p) => p.description },
    { header: 'state', value: (p) => p.state },
    { header: 'scope', value: (p) => p.scope },
    { header: 'type', value: (p) => p.type },
    { header: 'category_id', value: (p) => p.projectCategoryId },
    { header: 'organization_id', value: (p) => p.organization.id },
    { header: 'drive_id', value: (p) => p.drive?.id },
    { header: 'wiki_id', value: (p) => p.wiki?.id },
  ]);
}
