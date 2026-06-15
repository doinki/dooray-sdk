import type { DoorayApi } from '@dooray-sdk/client';
import type { HookCreateArgs } from '@dooray-sdk/core';
import { runProjectHookCreate } from '@dooray-sdk/core';
import { PROJECT_EVENTS, PROJECT_HOOK_EVENTS, PROJECT_HOOK_TYPES, TASK_EVENTS } from '@dooray-sdk/core/constants';
import { resolveProjectId } from '@dooray-sdk/core/resolve';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';

import { runTool } from '../../shared/result';
import type { ProjectScopedArgs } from '../../shared/scope';
import { projectScopeShape } from '../../shared/scope';

const inputSchema = {
  embedInlineImages: z
    .boolean()
    .default(false)
    .describe("Inline the body's image URLs as base64; affects only the post-body events (default: false)."),
  events: z
    .array(z.enum(PROJECT_HOOK_EVENTS))
    .describe(
      `Events to subscribe to; every entry must belong to the chosen type. Task: ${TASK_EVENTS.join(', ')}. Project: ${PROJECT_EVENTS.join(', ')}.`,
    ),
  includeBody: z
    .boolean()
    .default(false)
    .describe('Include the post/comment body in the payload; affects only the post-body events (default: false).'),
  ref: projectScopeShape.ref,
  type: z
    .enum(PROJECT_HOOK_TYPES)
    .optional()
    .describe('Event family: task or project; gates which events are valid (default: task).'),
  url: z.url().describe('Endpoint URL Dooray POSTs events to; a valid http(s) URL.'),
} satisfies Record<keyof ProjectScopedArgs<HookCreateArgs>, z.ZodType>;

export function registerProjectHookCreate(server: McpServer, api: DoorayApi): void {
  server.registerTool(
    'project_hook_create',
    {
      annotations: { destructiveHint: false, idempotentHint: false, openWorldHint: true, readOnlyHint: false },
      description:
        'Register an outbound webhook so Dooray POSTs the chosen events to url; type selects the event family and every event must belong to it.',
      inputSchema,
      title: 'Create project webhook',
    },
    (args) =>
      runTool(async () => {
        const projectId = await resolveProjectId({ api, ref: args.ref });

        return runProjectHookCreate({ api, args: { ...args, projectId } }).then((r) => r.data);
      }),
  );
}
