import { runProjectHookCreate } from '@dooray-sdk/core';
import { PROJECT_EVENTS, PROJECT_HOOK_EVENTS, PROJECT_HOOK_TYPES, TASK_EVENTS } from '@dooray-sdk/core/constants';
import { z } from 'zod';

import { defineSubcommand } from '../../../shared/command/define-subcommand';
import { runWithProjectScope } from '../../../shared/command/run-with-project-scope';
import { renderKeyValue } from '../../../shared/formatter/output-formatter';
import { splitCsv } from '../../../shared/schema/csv';
import { argsFromSchema } from '../../../shared/schema/derive-args';

export const hookCreateArgsSchema = z.object({
  embedInlineImages: z
    .boolean()
    .default(false)
    .describe(
      'Replace inline image URLs in the payload body with base64-encoded images (only applies to postCreated, postBodyChanged, postCommentCreated, postCommentUpdated)',
    ),
  events: z
    .string()
    .transform(splitCsv)
    .pipe(z.array(z.enum(PROJECT_HOOK_EVENTS)).min(1))
    .meta({ hint: 'event[,event...]' })
    .describe(
      `Comma-separated hook events. Allowed values depend on --type — task: ${TASK_EVENTS.join(', ')}; project: ${PROJECT_EVENTS.join(', ')}`,
    ),
  includeBody: z
    .boolean()
    .default(false)
    .describe(
      'Include the post body content in the hook payload (only applies to postCreated, postBodyChanged, postCommentCreated, postCommentUpdated)',
    ),
  type: z
    .enum(PROJECT_HOOK_TYPES)
    .optional()
    .describe('Hook type — task triggers on tasks, project triggers on project metadata (default: task)'),
  url: z.url().meta({ hint: 'url' }).describe('Webhook endpoint URL that will receive the events'),
});

export default defineSubcommand({
  args: argsFromSchema(hookCreateArgsSchema),
  meta: {
    description: 'Create an outbound webhook (one URL, multiple events; events depend on --type)',
    name: 'hook-create',
  },
  async run({ api, args, formatter }) {
    const { data } = await runWithProjectScope({
      api,
      args,
      formatter,
      render: renderPretty,
      run: runProjectHookCreate,
      schema: hookCreateArgsSchema,
    });

    formatter.printInfo(`Created webhook \`${data.url}\`.`);
  },
});

function renderPretty({ data }: Awaited<ReturnType<typeof runProjectHookCreate>>): string {
  return renderKeyValue([['ID', data.id]]);
}
