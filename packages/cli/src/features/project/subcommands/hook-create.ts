import type { HookCreateArgs } from '@dooray-sdk/core';
import { runProjectHookCreate } from '@dooray-sdk/core';
import { PROJECT_EVENTS, PROJECT_HOOK_EVENTS, PROJECT_HOOK_TYPES, TASK_EVENTS } from '@dooray-sdk/core/constants';
import { z } from 'zod';

import { defineSubcommand } from '../../../shared/command/define-subcommand';
import { globalArgsSchema } from '../../../shared/command/global-args';
import { runWithProjectScope } from '../../../shared/command/run-with-project-scope';
import { renderId } from '../../../shared/formatter/output-formatter';
import type { CommandSchemaShape } from '../../../shared/schemas/derive-args';
import { splitCsv } from '../../../shared/utils/csv';

const schema = globalArgsSchema.extend({
  embedInlineImages: z
    .boolean()
    .default(false)
    .describe("Inline the body's image URLs as base64; affects only the post-body events"),
  events: z
    .string()
    .transform(splitCsv)
    .pipe(z.array(z.enum(PROJECT_HOOK_EVENTS)).min(1))
    .meta({ hint: 'event[,event...]' })
    .describe(
      `Events to subscribe to, comma-separated; every entry must belong to --type. Task: ${TASK_EVENTS.join(', ')}. Project: ${PROJECT_EVENTS.join(', ')}.`,
    ),
  includeBody: z
    .boolean()
    .default(false)
    .describe('Include the post/comment body in the payload; affects only the post-body events'),
  type: z
    .enum(PROJECT_HOOK_TYPES)
    .optional()
    .describe('Event family: task or project; gates which events are valid (default: task)'),
  url: z.url().meta({ hint: 'url' }).describe('Endpoint URL Dooray POSTs events to; a valid http(s) URL'),
} satisfies CommandSchemaShape<HookCreateArgs>);

export default defineSubcommand({
  meta: { description: 'Register an outbound webhook that POSTs the chosen events to a URL', name: 'hook-create' },
  async run({ api, args, formatter }) {
    const { result } = await runWithProjectScope({
      api,
      args,
      formatter,
      render: renderId,
      run: runProjectHookCreate,
      schema,
    });

    formatter.printInfo(`Created hook \`${result.data.id}\`.`);
  },
  schema,
});
