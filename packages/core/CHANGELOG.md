# @dooray-sdk/core

## 0.2.0

### Minor Changes

- 6a68073: Consolidate wiki update and remove draft operations.
  - **Breaking:** `wiki update` is now a single partial-update operation — pass any of title, body, or cc and the rest are kept (read-modify-write). The separate `update-title` / `update-body` / `update-cc` core operations and their `wiki_update_title` / `_body` / `_cc` MCP tools are removed.
  - **Breaking:** Task draft support is removed from core (`runTaskCreateDraft`, `runTaskUploadDraftFile`) and from the MCP server (`task_create_draft`, `task_upload_draft_file`), since a draft can only be completed in the Dooray UI. The raw `@dooray-sdk/client` still exposes the underlying API.

## 0.1.1

### Patch Changes

- e716430: Fix task updates failing with a 400 error. The `version` field is now omitted instead of sent as `null`, so the update targets the latest revision.
- Updated dependencies [e716430]
  - @dooray-sdk/client@0.0.1

## 0.1.0

### Minor Changes

- 73a2216: Add wiki operations: pages, comments, files, and shared links.
