#!/usr/bin/env node
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';

import packageJson from '../package.json';
import { registerMemberTools } from './features/member';
import { registerProjectTools } from './features/project';
import { registerTaskTools } from './features/task';
import { createClient } from './shared/client';

const instructions = [
  'Dooray MCP: browse and manage projects, tasks, and members in the Dooray collaboration service.',
  '',
  "Auth: set DOORAY_TOKEN (a Dooray personal API token, required); DOORAY_BASE_URL overrides the endpoint (optional). Call member_me to confirm the token's account.",
  '',
  'Three tool families, each sharing the same verbs — `*_list` browses/pages with filters, `*_view` reads one item in full, `*_create`/`*_update`/`*_delete` write:',
  '- member_* — people in the tenant.',
  '- project_* — a project and its statuses, milestones, tags, members, templates, inbound emails, and webhooks.',
  '- task_* — tasks in a project, plus their comments and file attachments.',
  '',
  'ref: project- and task-scoped tools take a single `ref` (there is no projectId/taskId field) — a 19-digit id, a `<projectId>/<id>` pair, or a Dooray URL. On task tools `ref` is the task; on project tools it is the project (a bare id, or the owning project of a task/drive/wiki URL).',
  '',
  "Ids, not names: every filter and reference takes a 19-digit id — resolve a name first with the matching `*_list` or member_search tool. The only exceptions are task_list's member filters `@me` (the caller) and `none` (unassigned).",
  '',
  'Returns: `*_list` → `{data, paging}` (`page` 0-based, default 0; `size` default 50, max 100; a plain array wraps as `{data}`); `*_view` → the item; create → the new 19-digit id; other writes → the affected id.',
  '',
  'Writing: body fields default to Markdown; member fields take 19-digit ids or `@me`. task_update and task_comment_update replace assignees/cc/tagIds/fileIds wholesale (omit to keep them). File tools read and write LOCAL paths on the server host. create/upload tools are NOT idempotent (retrying duplicates); task_move and `*_delete` are irreversible from here.',
  '',
  'Errors: a failed call sets isError with `{error: {code, hint, message}}`; read `hint` and change the input before retrying — an identical retry fails identically.',
].join('\n');

const server = new McpServer(
  {
    description:
      'Browse, file, and update Dooray projects, tasks, and members — list and view items, create and edit tasks, manage comments and attachments.',
    name: packageJson.name,
    title: 'Dooray',
    version: packageJson.version,
  },
  { instructions },
);

const api = createClient();

registerMemberTools(server, api);
registerTaskTools(server, api);
registerProjectTools(server, api);

async function main() {
  const transport = new StdioServerTransport();

  await server.connect(transport);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
