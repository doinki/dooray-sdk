import type { ProjectTemplate } from '@dooray-sdk/client/project';
import { runProjectTemplateView } from '@dooray-sdk/core';
import { z } from 'zod';

import { defineSubcommand } from '../../../shared/command/define-subcommand';
import { runWithProjectScope } from '../../../shared/command/run-with-project-scope';
import { renderKeyValue } from '../../../shared/formatter/output-formatter';
import { argsFromSchema } from '../../../shared/utils/derive-args';
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
    ['ID', data.id],
    ['Name', data.templateName],
    ['Default', data.isDefault],
    ['Subject', data.subject],
    ['Priority', data.priority],
    ['Due', data.dueDate],
    ['Milestone', data.milestone ? `${data.milestone.name} (${data.milestone.id})` : null],
    ['Tag IDs', data.tags?.map((tag) => tag.id).join(', ')],
    ['Body', data.body.content],
    ['Body Mime', data.body.mimeType],
    ['To', data.users.to.map(formatTemplateUser).join(', ')],
    ['CC', data.users.cc?.map(formatTemplateUser).join(', ')],
  ]);
}

// Template groups carry no `code`, so expand their members locally; everything else shares formatUser.
function formatTemplateUser(user: ProjectTemplate['users']['to'][number]): string {
  if (user.type === 'group')
    return user.group.members.map((member) => formatUser({ member, type: 'member' }, { withId: true })).join(', ');
  return formatUser(user, { withId: true });
}
