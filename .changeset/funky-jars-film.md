---
'@dooray-sdk/core': patch
---

Fix task updates failing with a 400 error. The `version` field is now omitted instead of sent as `null`, so the update targets the latest revision.
