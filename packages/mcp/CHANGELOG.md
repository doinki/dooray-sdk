# @dooray-sdk/mcp

## 0.1.2

### Patch Changes

- 3bcdb01: Note in the `task_create` and `task_update` tool descriptions that projects may require tags. Point to `project_tag_list` so agents include any required tags and avoid creation/update failures.

## 0.1.1

### Patch Changes

- e716430: Drop `null` as an accepted `version` value in the `task_update` tool schema; omit the field to target the latest revision.
- Updated dependencies [e716430]
- Updated dependencies [e716430]
  - @dooray-sdk/core@0.1.1
  - @dooray-sdk/client@0.0.1

## 0.1.0

### Minor Changes

- 73a2216: Add MCP tools for Dooray wikis: pages, comments, files, and shared links.

### Patch Changes

- Updated dependencies [73a2216]
  - @dooray-sdk/core@0.1.0
