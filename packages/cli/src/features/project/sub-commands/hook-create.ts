import { runProjectHookCreate } from '@dooray-sdk/core';
import { PROJECT_EVENTS, PROJECT_HOOK_EVENTS, PROJECT_HOOK_TYPES, TASK_EVENTS } from '@dooray-sdk/core/constants';
import { z } from 'zod';

import { defineSubcommand } from '../../../shared/command/define-subcommand';
import { runWithProjectScope } from '../../../shared/command/run-with-project-scope';
import { renderKeyValue } from '../../../shared/formatter/output-formatter';
import { splitCsv } from '../../../shared/schema/csv';

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
  url: z.url().describe('Webhook endpoint URL that will receive the events'),
});

export default defineSubcommand({
  args: {
    'embed-inline-images': {
      description: hookCreateArgsSchema.shape.embedInlineImages.description,
      type: 'boolean',
    },
    events: {
      description: hookCreateArgsSchema.shape.events.description,
      required: true,
      type: 'string',
      valueHint: 'event[,event...]',
    },
    'include-body': {
      description: hookCreateArgsSchema.shape.includeBody.description,
      type: 'boolean',
    },
    type: {
      description: hookCreateArgsSchema.shape.type.description,
      options: [...PROJECT_HOOK_TYPES],
      type: 'enum',
    },
    url: {
      description: hookCreateArgsSchema.shape.url.description,
      required: true,
      type: 'string',
      valueHint: 'url',
    },
  },
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
