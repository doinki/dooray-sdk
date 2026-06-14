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
    .describe(
      "Inline the body's image URLs as base64; affects only postCreated, postBodyChanged, postCommentCreated, postCommentUpdated (default: false).",
    ),
  events: z
    .array(z.enum(PROJECT_HOOK_EVENTS))
    .describe(
      `Events to subscribe to; every entry must belong to the chosen type or the API rejects the call — task: ${TASK_EVENTS.join(', ')}; project: ${PROJECT_EVENTS.join(', ')}.`,
    ),
  includeBody: z
    .boolean()
    .default(false)
    .describe(
      'Include the post/comment body in the payload; affects only postCreated, postBodyChanged, postCommentCreated, postCommentUpdated (default: false).',
    ),
  ref: projectScopeShape.ref,
  type: z
    .enum(PROJECT_HOOK_TYPES)
    .optional()
    .describe(
      'Event family this webhook listens on — task for task events, project for project-metadata events; gates which events are valid (default: task).',
    ),
  url: z.url().describe('Endpoint URL Dooray POSTs events to; a valid http(s) URL.'),
} satisfies Record<keyof ProjectScopedArgs<HookCreateArgs>, z.ZodType>;

export function registerProjectHookCreate(server: McpServer, api: DoorayApi): void {
  server.registerTool(
    'project_hook_create',
    {
      annotations: { destructiveHint: false, idempotentHint: false, openWorldHint: true, readOnlyHint: false },
      description:
        'Register an outbound webhook on a project so Dooray POSTs the chosen events to url. type selects the event family (task — default — or project), and every entry in events must belong to that family. includeBody and embedInlineImages affect only the post-body events.',
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
