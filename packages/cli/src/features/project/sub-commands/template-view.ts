import type { ProjectTemplate } from '@dooray-sdk/client/project';
import { runProjectTemplateView } from '@dooray-sdk/core';
import { z } from 'zod';

import { defineSubcommand } from '../../../shared/command/define-subcommand';
import { runWithProjectScope } from '../../../shared/command/run-with-project-scope';
import { renderKeyValue } from '../../../shared/formatter/output-formatter';
import { argsFromSchema } from '../../../shared/schemas/derive-args';
import { formatUser } from '../../../shared/utils/user';

const schema = z.object({
  expand: z
    .boolean()
    .optional()
    .describe(
      'When true, expand template macros (e.g. `$' +
        '{year}`) in the response. When false/omitted, return them literally',
    ),
  id: z.string().min(1).meta({ hint: 'templateId', positional: true }).describe('Template id'),
});

export default defineSubcommand({
  args: argsFromSchema(schema),
  meta: {
    // oxlint-disable-next-line no-template-curly-in-string
    description: "Show a task template's full content; expand substitutes ${...} macros",
    name: 'template-view',
  },
  async run({ api, args, formatter }) {
    await runWithProjectScope({
      api,
      args,
      formatter,
      render: renderPretty,
      run: runProjectTemplateView,
      schema,
    });
  },
});

function renderPretty({ data }: Awaited<ReturnType<typeof runProjectTemplateView>>): string {
  return renderKeyValue([
    ['id', data.id],
    ['name', data.templateName],
    ['default', data.isDefault],
    ['subject', data.subject],
    ['priority', data.priority],
    ['due', data.dueDate],
    ['milestone', data.milestone ? `${data.milestone.name} (${data.milestone.id})` : null],
    ['tagIds', data.tags?.map((tag) => tag.id).join(', ')],
    ['body', data.body.content],
    ['bodyMime', data.body.mimeType],
    ['to', data.users.to.map(formatTemplateUser).join(', ')],
    ['cc', data.users.cc?.map(formatTemplateUser).join(', ')],
  ]);
}

// Template groups carry no `code`, so expand their members locally; everything else shares formatUser.
function formatTemplateUser(user: ProjectTemplate['users']['to'][number]): string {
  if (user.type === 'group')
    return user.group.members.map((member) => formatUser({ member, type: 'member' }, { withId: true })).join(', ');
  return formatUser(user, { withId: true });
}
