# @dooray-sdk/mcp

The Dooray MCP server connects AI agents to [Dooray](https://dooray.com), letting them browse and manage projects, tasks, and members through natural language. It runs over stdio on top of `@dooray-sdk/core` and `@dooray-sdk/client`.

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

Tools are named `<scope>_<action>`. Project- and task-scoped tools take a single `ref` (see [References](#references)).

- **`member_*`** — current user, search, view
- **`project_*`** — list, view, create, check name; members and member groups; milestones; statuses; tags; templates; categories; email addresses; hooks
- **`task_*`** — list, view, create (and drafts), update, close, move, set parent / status / assignee status; comments; file attachments

## References

Project- and task-scoped tools use a single `ref` argument:

- a 19-digit Dooray id
- a `<projectId>/<taskId>` pair
- a Dooray URL

On project-scoped tools `ref` identifies the project; on task-scoped tools it identifies the task. A bare id is read according to the tool's scope.
