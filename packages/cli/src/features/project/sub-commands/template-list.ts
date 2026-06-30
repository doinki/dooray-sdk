import type { ProjectTemplateSummary } from '@dooray-sdk/client/project';
import { runProjectTemplateList } from '@dooray-sdk/core';
import { pageSchema, sizeSchema } from '@dooray-sdk/core/schemas';

import { defineSubcommand } from '../../../shared/command/define-subcommand';
import { globalArgsSchema } from '../../../shared/command/global-args';
import { runWithProjectScope } from '../../../shared/command/run-with-project-scope';
import { renderPagingFooter } from '../../../shared/formatter/output-formatter';
import { renderList } from '../../../shared/utils/table';
import { formatUser } from '../../../shared/utils/user';

const schema = globalArgsSchema.extend({
  page: pageSchema,
  size: sizeSchema,
});

export default defineSubcommand({
  meta: {
    description: 'List task templates (body/guide omitted; use template-view)',
    name: 'template-list',
  },
  async run({ api, args, formatter }) {
    const { result } = await runWithProjectScope({
      api,
      args,
      formatter,
      render: renderPretty,
      run: runProjectTemplateList,
      schema,
    });

    formatter.printInfo(result.data.length === 0 ? 'No templates.' : renderPagingFooter(result.paging));
  },
  schema,
});

function renderPretty({ data }: Awaited<ReturnType<typeof runProjectTemplateList>>): null | string {
  if (data.length === 0) return null;

  return renderList(data, [
    { header: 'id', value: (t) => t.id },
    { header: 'name', value: (t) => t.templateName },
    { header: 'default', value: (t) => (t.isDefault ? '✓' : '-') },
    { header: 'title', value: (t) => t.subject },
    { header: 'priority', value: (t) => t.priority },
    { header: 'milestone', value: (t) => (t.milestone ? `${t.milestone.name}(${t.milestone.id})` : undefined) },
    { header: 'to', value: (t) => formatUsers(t.users.to) },
    { header: 'cc', value: (t) => formatUsers(t.users.cc) },
  ]);
}

function formatUsers(users?: ProjectTemplateSummary['users']['cc'] | ProjectTemplateSummary['users']['to']): string {
  if (!users?.length) return '-';
  return users.map((user) => formatUser(user)).join(', ');
}
