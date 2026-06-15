#!/usr/bin/env node
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';

import packageJson from '../package.json';
import { registerMemberTools } from './features/member';
import { registerProjectTools } from './features/project';
import { registerTaskTools } from './features/task';
import { registerWikiTools } from './features/wiki';
import { createClient } from './shared/client';

const instructions = [
  'Browse and manage Dooray projects, tasks, members, and wikis.',
  '',
  'Setup: `DOORAY_TOKEN` (a personal API token) is required; `DOORAY_BASE_URL` overrides the API endpoint. Call `member_me` to confirm which account the token belongs to.',
  '',
  'Tools: named `<entity>_<verb>` — shared verbs are `_list` (browse), `_view` (read one), and `_create` / `_update` / `_delete` (write).',
  '- `member_*` — people in the tenant.',
  '- `project_*` — projects and their statuses, milestones, tags, members, templates, inbound emails, and webhooks.',
  '- `task_*` — tasks and their comments and attachments.',
  '- `wiki_*` — wiki pages and their comments, attachments, and shared links.',
  '',
  "Refs: most tools take a single `ref` instead of separate id fields, and each tool's `ref` description lists the forms it accepts.",
  '',
  "Files: file tools read from and write to the server host's filesystem, not the agent's own.",
  '',
  'Errors: a failed call sets `isError` and returns `{error: {code, hint, message}}`. Follow the `hint` to fix the input before retrying, since an identical retry fails the same way.',
].join('\n');

const server = new McpServer(
  {
    description: packageJson.description,
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
registerWikiTools(server, api);

async function main() {
  const transport = new StdioServerTransport();

  await server.connect(transport);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
