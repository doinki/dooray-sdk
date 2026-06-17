import { runProjectList } from '@dooray-sdk/core';
import { PROJECT_SCOPES, PROJECT_STATES, PROJECT_TYPES } from '@dooray-sdk/core/constants';
import { pageSchema, sizeSchema } from '@dooray-sdk/core/schemas';
import { z } from 'zod';

import { defineSubcommand } from '../../../shared/command/define-subcommand';
import { renderPagingFooter } from '../../../shared/formatter/output-formatter';
import { renderList } from '../../../shared/formatter/table';
import { parseArgsOrThrow } from '../../../shared/schema/parse-args';

export const projectListArgsSchema = z.object({
  member: z
    .string()
    .default('me')
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
});

export default defineSubcommand({
  args: {
    member: {
      description: projectListArgsSchema.shape.member.description,
      type: 'string',
      valueHint: 'member',
    },
    page: { description: projectListArgsSchema.shape.page.description, type: 'string', valueHint: 'n' },
    scope: {
      description: projectListArgsSchema.shape.scope.description,
      options: [...PROJECT_SCOPES],
      type: 'enum',
    },
    size: { description: projectListArgsSchema.shape.size.description, type: 'string', valueHint: 'n' },
    state: {
      description: projectListArgsSchema.shape.state.description,
      options: [...PROJECT_STATES],
      type: 'enum',
    },
    type: {
      description: projectListArgsSchema.shape.type.description,
      options: [...PROJECT_TYPES],
      type: 'enum',
    },
  },
  globalArgs: ['json', 'profile', 'verbose'],
  meta: { description: 'List projects accessible to the caller, with filters and pagination', name: 'list' },
  async run({ api, args, formatter }) {
    const data = parseArgsOrThrow(projectListArgsSchema, args);

    const result = await runProjectList({
      api,
      args: data,
    });

    formatter.printData(result, renderPretty);
    formatter.printInfo(result.data.length === 0 ? 'No projects.' : renderPagingFooter(result.paging));
  },
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
