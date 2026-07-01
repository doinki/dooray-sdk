# @dooray-sdk/mcp

The Dooray MCP server connects AI agents to [Dooray](https://dooray.com), letting them browse and manage projects, tasks, members, and wikis through natural language. It runs over stdio on top of `@dooray-sdk/core` and `@dooray-sdk/client`.

## Run

```sh
npx -y @dooray-sdk/mcp
```

## Requirements

- Node.js 22.12 or later
- A Dooray personal API token
- An MCP client that supports stdio servers

## Configuration

The server is configured with environment variables:

| Variable          | Required | Default                  | Description               |
| ----------------- | -------- | ------------------------ | ------------------------- |
| `DOORAY_TOKEN`    | Yes      | —                        | Dooray personal API token |
| `DOORAY_BASE_URL` | No       | `https://api.dooray.com` | API endpoint to use       |

Other endpoints: `https://api.gov-dooray.com`, `https://api.gov-dooray.co.kr`, `https://api.dooray.co.kr`.

## MCP Client Setup

Add a stdio server entry to your MCP client configuration:

```json
{
  "mcpServers": {
    "dooray": {
      "command": "npx",
      "args": ["-y", "@dooray-sdk/mcp"],
      "env": {
        "DOORAY_TOKEN": "your-dooray-api-token"
      }
    }
  }
}
```

## Tools

Tools are named `<entity>_<verb>` and share a common set of verbs: `_list` (browse), `_view` (read one), and `_create` / `_update` / `_delete` (write). Project-, task-, and wiki-scoped tools take a single `ref` (see [References](#references)).

- **`member_*`** — current user, search, view
- **`project_*`** — list, view, create, check name; members and member groups; milestones; statuses; tags; templates; categories; email addresses; hooks
- **`task_*`** — list, view, create, update, close, move, set parent / status / assignee status; comments; file attachments
- **`wiki_*`** — list wikis and pages, view, create, update, delete, move; comments; file attachments; shared links

## References

Project-, task-, and wiki-scoped tools use a single `ref` argument:

- a 19-digit Dooray id
- a `<projectId>/<id>` pair
- a Dooray URL

`ref` resolves according to the tool's scope: the project on `project_*`, the task on `task_*`, and the wiki page on `wiki_*`. On project-scoped tools, a task, drive, or wiki URL resolves to its owning project.
