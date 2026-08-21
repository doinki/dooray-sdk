import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

export const BODY_SYNTAX_URI = 'dooray-mcp://docs/body-syntax';

/** One-line pointer appended to the `body` description of every body-accepting tool. */
export const BODY_SYNTAX_HINT = `Dooray Markdown extensions (task links, mentions, callouts, layouts, embeds) are documented in the ${BODY_SYNTAX_URI} resource.`;

const BODY_SYNTAX = [
  '# Dooray body syntax',
  '',
  'Task and wiki bodies and comments render Dooray-flavored Markdown. Prefer standard Markdown; use extensions only where they clearly improve readability.',
  '',
  '## Links and references',
  '',
  '- Task link — `[text](dooray://<organizationId>/tasks/<taskId>)`. Rendered links gain `project/number | title` metadata, so put them on their own line in long sentences. The organization id is `defaultOrganization.id` from `member_me`.',
  '- Member mention — `[@Name](dooray://<organizationId>/members/<memberId>)`',
  '- Inline image — `![alt](/files/<fileId>)`; file ids come from the file upload tools.',
  '',
  '## Blocks',
  '',
  'Inside HTML-wrapped blocks (collapsible, columns), put blank lines around the inner Markdown or it will not render.',
  '',
  '- Callout — a quote block; types: NOTE, TIP, IMPORTANT, WARNING, CAUTION.',
  '',
  '  ```',
  '  > [!NOTE]',
  '  > content',
  '  ```',
  '',
  '- Collapsible — omit `open` to start collapsed.',
  '',
  '  ```',
  '  <details open>',
  '  <summary><span>Title</span></summary>',
  '',
  '  content',
  '',
  '  </details>',
  '  ```',
  '',
  '- Columns — 2-5 columns; the number of `1fr` values sets count and ratio, with one `data-dooray-layout-item` per column.',
  '',
  '  ```',
  '  <div data-dooray-layout-container style="grid-template-columns: 1fr 1fr">',
  '  <div data-dooray-layout-item>',
  '',
  '  column 1',
  '',
  '  </div>',
  '  <div data-dooray-layout-item>',
  '',
  '  column 2',
  '',
  '  </div>',
  '  </div>',
  '  ```',
  '',
  '## Inline',
  '',
  "- Date/time — `:datetime[2026-07-01T00:00:00+09:00]` (ISO 8601 with timezone); renders in each viewer's locale.",
  '',
  '## Code fences',
  '',
  '- `uml` (PlantUML), `mermaid`, `chart` — the fence holds the definition.',
  '- `embed` — the fence holds a single URL.',
].join('\n');

export function registerBodySyntaxResource(server: McpServer): void {
  server.registerResource(
    'body-syntax',
    BODY_SYNTAX_URI,
    {
      annotations: { audience: ['assistant'] },
      description:
        'Dooray-flavored Markdown extensions for task/wiki bodies and comments. Read before writing a body that needs task links, member mentions, callouts, collapsibles, column layouts, `:datetime`, or diagram/embed fences.',
      mimeType: 'text/markdown',
      size: Buffer.byteLength(BODY_SYNTAX),
      title: 'Dooray body syntax',
    },
    (uri) => ({ contents: [{ mimeType: 'text/markdown', text: BODY_SYNTAX, uri: uri.href }] }),
  );
}
