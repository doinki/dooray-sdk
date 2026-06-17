# @dooray-sdk/cli

`dooray` is a terminal client for [Dooray](https://dooray.com) — browse and manage projects, tasks, members, and wikis from the command line. It mirrors the [`@dooray-sdk/mcp`](../mcp) tool set on top of `@dooray-sdk/core` and `@dooray-sdk/client`, and favors everyday terms (task, status, assignee, …) over raw API wording.

## Install

```sh
npm install -g @dooray-sdk/cli
# or run without installing
npx -y @dooray-sdk/cli --help
```

## Requirements

- Node.js 22.12 or later
- A Dooray personal API token

## Authentication

Log in once to store a token in a named profile (kept in your OS config dir):

```sh
dooray auth login          # prompts for environment, token, and a profile name
dooray auth status         # show the active profile
```

Manage and switch profiles:

```sh
dooray profile list
dooray profile use work
dooray profile add         # add another account/environment
dooray profile remove work
```

Use `--profile <name>` (or `$DOORAY_PROFILE`) to override the active profile for a single invocation.

## Commands

Commands are grouped `dooray <group> <verb>`, sharing the verbs `list`, `view`, `create`, `update`, and `delete`.

- **`auth`**, **`profile`** — local setup: authentication and profile management.
- **`member`** — `me`, `search`, `view`.
- **`project`** — projects and their members, member groups, milestones, statuses, tags, templates, categories, email addresses, and hooks.
- **`task`** — `list`, `view`, `create` (and `create-draft`), `update`, `close`, `move`, `set-status` / `set-parent` / `set-assignee-status`; comments; file attachments.
- **`wiki`** — wikis and pages: `list`, `view`, `create`, `update` (and `update-title` / `update-body` / `update-cc`), `delete`, `move`; comments; file attachments; shared links.

Run `dooray <group> --help` or `dooray <group> <verb> --help` for the full, generated argument list.

## References (`--ref`)

Project-, task-, and wiki-scoped commands target a Dooray entity. Pass it as a positional id, or with `--ref` (also read from `$DOORAY_REF`):

- a 19-digit Dooray id — `dooray task view 4042598371821...`
- a `<projectId>/<id>` pair — `dooray task view 3486...0/4042...1`
- a Dooray URL — `dooray task view 'https://nhn.dooray.com/project/.../posts/...'`

Project-scoped commands (e.g. `task create`, `wiki list`) take the project via `--ref`. Task/wiki-scoped commands accept the entity id as a positional argument and fall back to `--ref`.

## Output (`--json`, `--jq`)

Commands print a human-readable table by default. For scripting:

| Flag           | Effect                                                                        |
| -------------- | ----------------------------------------------------------------------------- |
| `--json`       | Emit the full result as JSON (stable contract; also via `$DOORAY_JSON=true`). |
| `--json=a,b,c` | Emit JSON with only these fields, projected over each item.                   |
| `--jq <expr>`  | Filter the JSON through `jq` (implies `--json`; requires the `jq` binary).    |

```sh
dooray task list --ref <project> --json
dooray task list --ref <project> --json=taskNumber,subject
dooray task list --ref <project> --jq '.data[] | {id, subject, status: .workflow.name}'
```

## Global flags

`--json`, `--jq`, `--profile <name>`, `--ref <ref>`, and `--verbose` are available wherever they apply. Destructive commands prompt for confirmation; pass `--yes` to skip it (required for non-interactive use).

## Contributing — adding a command

Each command lives in `src/features/<group>/sub-commands/<name>.ts` and is **schema-driven**: define a [zod](https://zod.dev) schema once, and `argsFromSchema` derives the CLI arguments (type, description, enum choices, required-ness) from it — there is no separate hand-written `args` block to keep in sync.

```ts
import { argsFromSchema } from '../../../shared/schema/derive-args';
import { requireTaskRef, taskRefShape } from '../../../shared/schema/fields';

export const taskSetStatusArgsSchema = requireTaskRef(
  z.object({
    ...taskRefShape, // shared <taskId> positional + --ref
    statusId: z.string().min(1).meta({ hint: 'statusId' }).describe('Status id to move the task to'),
  }),
);

export default defineSubcommand({
  args: argsFromSchema(taskSetStatusArgsSchema),
  meta: { description: 'Set a task to any project status', name: 'set-status' },
  async run({ api, args, formatter }) {
    /* ... */
  },
});
```

Attach CLI-specific hints via `.meta({ hint, alias, positional })`. Shared field helpers live in `src/shared/schema/fields.ts`: `taskRefShape` / `wikiRefShape` (+ `requireTaskRef` / `requireWikiRef`), `csvField` / `requiredCsvField` (comma lists), `confirmField` (`--yes`), and `allField` (`--all`).

## License

MIT
