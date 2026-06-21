# CLAUDE.md

Claude Code가 `dooray-sdk` 프로젝트에서 작업할 때 참고하는 컨텍스트 문서입니다.

## 프로젝트 개요

두레이(Dooray) API 문서를 바탕으로 **Dooray CLI**와 **Dooray MCP**를 개발하는 모노레포 프로젝트입니다.

- **CLI**: 1순위 대상은 개발자, 2순위는 AI Agent. 개발자 DX와 AI Agent 활용성을 모두 고려합니다.
- **MCP**: AI Agent를 위한 기능입니다.

## 두레이 API 문서

모든 기능은 `docs/external/*.md`의 두레이 API 문서를 근거로 구현합니다.

- `dooray-api.md`
- `dooray-api-drive-guide.md`
- `dooray-api-file-transfer-guide.md`
- `dooray-api-messenger-direct-send.md`

## 패키지 구조

| 패키지               | 경로              | 역할                                      |
| -------------------- | ----------------- | ----------------------------------------- |
| `@dooray-sdk/client` | `packages/client` | 두레이 API를 직접 호출하는 최하위 계층    |
| `@dooray-sdk/core`   | `packages/core`   | CLI·MCP 공통 로직. `client` 기반으로 동작 |
| `@dooray-sdk/cli`    | `packages/cli`    | Dooray CLI                                |
| `@dooray-sdk/mcp`    | `packages/mcp`    | Dooray MCP                                |

## 의존성 방향

- `core` → `client`
- `cli`, `mcp` → `core` + `client` (둘 다 dependencies에 직접 포함)
