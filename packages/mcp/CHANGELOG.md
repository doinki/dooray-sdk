# @dooray-sdk/mcp

## 0.2.0

### Minor Changes

- 6a68073: Consolidate wiki update and remove draft operations.
  - **Breaking:** `wiki update` is now a single partial-update operation — pass any of title, body, or cc and the rest are kept (read-modify-write). The separate `update-title` / `update-body` / `update-cc` core operations and their `wiki_update_title` / `_body` / `_cc` MCP tools are removed.
  - **Breaking:** Task draft support is removed from core (`runTaskCreateDraft`, `runTaskUploadDraftFile`) and from the MCP server (`task_create_draft`, `task_upload_draft_file`), since a draft can only be completed in the Dooray UI. The raw `@dooray-sdk/client` still exposes the underlying API.

### Patch Changes

- Updated dependencies [6a68073]
  - @dooray-sdk/core@0.2.0

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
