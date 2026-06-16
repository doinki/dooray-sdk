# @dooray-sdk/core

## 0.1.1

### Patch Changes

- e716430: Fix task updates failing with a 400 error. The `version` field is now omitted instead of sent as `null`, so the update targets the latest revision.
- Updated dependencies [e716430]
  - @dooray-sdk/client@0.0.1

## 0.1.0

### Minor Changes

- 73a2216: Add wiki operations: pages, comments, files, and shared links.
